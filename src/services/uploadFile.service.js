import ImageKit from "@imagekit/nodejs"

const imageKit = new ImageKit({
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY
})

const uploadFile = async (file, fileName) => {
    const response = await imageKit.files.upload({
        file, 
        fileName,
        folder: "/employee-management-app"
    })
    
    return response
}

export {imageKit, uploadFile}