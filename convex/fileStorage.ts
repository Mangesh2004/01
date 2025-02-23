import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Generate an upload URL for the file
export const generateUploadUrl = mutation(async (ctx) => {
  return await ctx.storage.generateUploadUrl();
});


export const AddFileEntrytoDB= mutation({
    args:{
        fileId:v.string(),
        storageId:v.string(),
        fileName:v.string(),
        fileURL:v.string(),
        
    },
    handler:async(ctx,args)=>{
        const result= await ctx.db.insert('pdfFiles',{
            fileId:args.fileId,
            storageId:args.storageId,
            fileName:args.fileName,
            fileURL:args.fileURL,
            
        })
        return 'Inserted'
    }

})

export const getFileURL=mutation({
    args:{
        storageId:v.string()
    },
    handler:async(ctx,args)=>{
        const url=await ctx.storage.getUrl(args.storageId)
        return url;
    }
})
