import { NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";

export const POST = async (request) => {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    
    if (!file || typeof file === "string") {
      return NextResponse.json(
        { success: false, message: "Nenhum arquivo válido enviado" },
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    const uploadDir = path.join(process.cwd(), "public/uploads");
    await fs.mkdir(uploadDir, { recursive: true });

    const buffer = Buffer.from(await file.arrayBuffer());
    const timestamp = Date.now();
    const filename = `${timestamp}_${file.name.replace(/\s+/g, '_')}`;
    const filePath = path.join(uploadDir, filename);

    await fs.writeFile(filePath, buffer);

    return NextResponse.json({
      success: true,
      filename: `/uploads/${filename}`
    }, {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error("Erro no upload:", error);
    return NextResponse.json(
      { success: false, message: "Erro interno no servidor" },
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
};
