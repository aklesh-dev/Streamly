import { Request } from "express";
import TryCatch from "./middleware/TryCatch.js";
import getBuffer from "./lib/dataUri.js";
import cloudinary from "cloudinary";
import { sqlDB } from "./lib/db.config.js";

interface AuthenticatedRequest extends Request {
  user?: {
    _id: string;
    role: string;
  };
}

export const addAlbum = TryCatch(async (req: AuthenticatedRequest, res) => {
  if (req.user?.role !== "admin") {
    res
      .status(401)
      .json({ message: "Unauthorized access - Only admin can add albums" });
    return;
  }
  const { title, description } = req.body;
  const file = req.file;
  if (!file) {
    res.status(400).json({ message: "No file provided" });
    return;
  }

  const fileBuffer = getBuffer(file);
  if (!fileBuffer || !fileBuffer.content) {
    res.status(500).json({ message: "Error while processing file" });
    return;
  }

  // * Cloudinary integration here
  const cloud = await cloudinary.v2.uploader.upload(fileBuffer.content, {
    folder: "albums",
  });

  // * Save album details to database here
  const result = await sqlDB`
    INSERT INTO albums (title, description, thumbnail) VALUES (${title}, ${description}, ${cloud.secure_url}) RETURNING *
  `;

  res.status(201).json({
    message: "Album added successfully",
    data: result[0],
  });
});

export const addSong = TryCatch(async (req: AuthenticatedRequest, res) => {
  if (req.user?.role !== "admin") {
    res
      .status(401)
      .json({ message: "Unauthorized access - Only admin can add songs" });
    return;
  }
  const { title, description, album } = req.body;

  const isAlbumExists = await sqlDB`SELECT * FROM albums WHERE id = ${album}`;
  if (!isAlbumExists.length) {
    res.status(400).json({ message: "Album does not exist" });
    return;
  }

  const file = req.file;
  if (!file) {
    res.status(400).json({ message: "No file provided" });
    return;
  }

  const fileBuffer = getBuffer(file);
  if (!fileBuffer || !fileBuffer.content) {
    res.status(500).json({ message: "Error while processing file" });
    return;
  }

  // * Cloudinary integration here
  const cloud = await cloudinary.v2.uploader.upload(fileBuffer.content, {
    folder: "songs",
    resource_type: "video",
  });

  // * Save song details to database here
  const result = await sqlDB`
    INSERT INTO songs (title, description, album_id, audio) VALUES (${title}, ${description}, ${album}, ${cloud.secure_url})
  `;

  res.status(201).json({
    message: "Song added successfully",
  });
});

export const addThumbnail = TryCatch(async (req: AuthenticatedRequest, res) => {
  if (req.user?.role !== "admin") {
    res
      .status(401)
      .json({ message: "Unauthorized access - Only admin can add thumbnails" });
    return;
  }

  const song = await sqlDB`SELECT * FROM songs WHERE id = ${req.params.id}`;
  if (!song.length) {
    res.status(400).json({ message: "Song does not exist with this id" });
    return;
  }

  const file = req.file;
  if (!file) {
    res.status(400).json({ message: "No file provided" });
    return;
  }

  const fileBuffer = getBuffer(file);
  if (!fileBuffer || !fileBuffer.content) {
    res.status(500).json({ message: "Error while processing file" });
    return;
  }

  // * Cloudinary integration here
  const cloud = await cloudinary.v2.uploader.upload(fileBuffer.content);

  const result = await sqlDB`
    UPDATE songs SET thumbnail = ${cloud.secure_url} WHERE id = ${req.params.id} RETURNING *
  `;

  res.status(200).json({
    message: "Thumbnail added successfully",
    data: result[0],
  });
});

export const deleteAlbum = TryCatch(async (req: AuthenticatedRequest, res) => {
  if (req.user?.role !== "admin") {
    res
      .status(401)
      .json({ message: "Unauthorized access - Only admin can delete albums" });
    return;
  }

  const { id } = req.params;

  const isAlbumExists = await sqlDB`SELECT * FROM albums WHERE id = ${id}`;
  if (!isAlbumExists.length) {
    res.status(400).json({ message: "Album does not exist" });
    return;
  }

  await sqlDB`DELETE FROM songs WHERE album_id = ${id}`;
  await sqlDB` DELETE FROM albums WHERE id = ${id} `;

  res.status(200).json({
    message: "Album deleted successfully",
  });
});

export const deleteSong = TryCatch(async (req: AuthenticatedRequest, res) => {
  if (req.user?.role !== "admin") {
    res.status(401).json({
      message: "You are not admin",
    });
    return;
  }

  const { id } = req.params;

  const song = await sqlDB`SELECT * FROM songs WHERE id = ${id}`;

  if (song.length === 0) {
    res.status(404).json({
      message: "No song with this id",
    });
    return;
  }

  await sqlDB`DELETE FROM  songs WHERE id = ${id}`;
  res.status(200).json({
    message: "Song deleted successfully",
  });

 
});
