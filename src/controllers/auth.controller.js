import asyncHandler from "../utils/asyncHandler.js";
import User from "../models/user.model.js";
import uploadFile from "../services/uploadFile.service.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { options } from "../constants.js";
import jwt from "jsonwebtoken";
import ImageKit from "@imagekit/nodejs";
import Organization from "../models/organization.model.js";

async function generateAccessAndRefreshToken(userId) {
  const user = await User.findById(userId);

  const refreshToken = user.generateRefreshToken();
  const accessToken = user.generateAccessToken();

  if (!refreshToken || !accessToken) {
    throw new ApiError(500, "failed to generate authentications tokens");
  }

  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  return { accessToken, refreshToken };
}

const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password, role, organization } = req.body;

  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new ApiError(409, "user already exist with this username or email");
  }

  const { file } = req;
  let fileUrl = null;
  let fileId = null;

  if (file) {
    const { buffer, originalname } = file;
    const response = await uploadFile(buffer.toString("base64"), originalname);
    fileUrl = response.url;
    fileId = response.fileId;
  }

  const existedOrganization = await Organization.findOne({
    name: organization,
  });
  const createdOrganization = null;

  if (!existedOrganization && role === "admin") {
    createdOrganization = await Organization.create({ name: organization });

    if (!createdOrganization) {
      throw new ApiError(500, "failed to create organization")
    }
  }

  const user = await User.create({
    username,
    email,
    password,
    role,
    avatar: {
      url: fileUrl,
      id: fileId,
    },
    organization: createdOrganization
      ? createdOrganization._id
      : existedOrganization._id,
  });

  if (!user) {
    throw new ApiError(500, "failed to create user");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  return res
    .status(201)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .cookie("organization", user.organization, options)
    .json(
      new ApiResponse(
        201,
        {
          user: createdUser,
          accessToken,
          refreshToken,
        },
        "user registered successfully"
      )
    );
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(500, "email is incorrect, please try again");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "password is incorrect, please try again");
  }

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User loggedIn successfully!"
      )
    );
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    throw new ApiError(400, "Unauthorized request");
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    const user = await User.findById(decoded._id);

    const accessToken = user.generateAccessToken();

    if (!accessToken) {
      throw new ApiError(
        500,
        "Something went wrong while generating access token"
      );
    }

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .json(
        new ApiResponse(
          200,
          {
            accessToken,
          },
          "access token refreshed successfully!"
        )
      );
  } catch (error) {
    throw new ApiError(401, "invalid refresh token");
  }
});

const updateAvatar = asyncHandler(async (req, res) => {
  const { file, user } = req;

  if (!file) {
    throw new ApiError(400, "avatar file is missing");
  }

  const response = await uploadFile(
    file.buffer.toString("base64"),
    file.originalname
  );

  if (!response) {
    throw new ApiError(500, "something went wrong while uploading file");
  }

  const loggedInUser = await User.findById(user._id);
  await ImageKit.deleteFile(loggedInUser.avatar.id);
  loggedInUser.avatar.url = response.url;
  loggedInUser.avatar.id = response.fileId;
  await loggedInUser.save({ valideBeforeSave: false });

  const updatedUser = await User.findById(loggedInUser._id).select(
    "-password -refreshToken"
  );

  return res.status(201).json(
    new ApiResponse(
      201,
      {
        user: updatedUser,
      },
      "avatar updated successfully!"
    )
  );
});

const logoutUser = asyncHandler(async (req, res) => {
  const { user } = req;

  const loggedInUser = await User.findById(user._id);

  if (!loggedInUser) {
    throw new ApiError(500, "user not found");
  }

  const updatedUser = await User.findByIdAndUpdate(
    loggedInUser._id,
    { $unset: { refreshToken: 1 } },
    { new: true }
  );

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(
      new ApiResponse(
        200,
        {
          user: updatedUser,
        },
        "user logout successfully !"
      )
    );
});

const deleteUser = asyncHandler(async (req, res) => {});

export {
  registerUser,
  loginUser,
  refreshAccessToken,
  updateAvatar,
  logoutUser,
  deleteUser,
};