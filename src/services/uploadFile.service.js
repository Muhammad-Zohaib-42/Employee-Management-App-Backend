import ImageKit from "@imagekit/nodejs"

const client = new ImageKit({
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY
})

const uploadFile = async (file, fileName) => {
    const response = await client.files.upload({
        file, 
        fileName,
        folder: "/employee-management-app"
    })
    
    return response
}

export default uploadFile