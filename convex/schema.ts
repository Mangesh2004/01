// pdfFiles:defineTable({
//     fileId:v.string(),
//     storageId:v.string(),
//     fileName:v.string(),
//     fileURL:v.string(),
//     createdBy:v.string(),
// })

import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    pdfFiles:defineTable({
        fileId:v.string(),
        storageId:v.string(),
        fileName:v.string(),
        fileURL:v.string(),
        
    })
})