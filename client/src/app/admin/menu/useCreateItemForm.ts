"use client";

import { useState, useEffect, useRef } from "react";

interface Category {
  id: number;
  name: string;
}

export function useCreateItemForm(reload: () => void, onClose: () => void) {
  const API = process.env.NEXT_PUBLIC_API_URL;
  const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;
  const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!;
  const FOLDER = process.env.NEXT_PUBLIC_CLOUDINARY_FOLDER || "";

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [localCategories, setLocalCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  const [ingredientsText, setIngredientsText] = useState("");

  function cleanIngredientsText(text: string) {
    return text
      .replace(/,+/g, ",")
      .replace(/\s*,\s*/g, ", ")
      .trim();
  }

  const [form, setForm] = useState({
    name: "",
    description: "",
    category_id: "",
    price: "",
    imageUrl: "",
  });

  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await fetch(`${API}/api/categories`);
        const data = await res.json();
        setLocalCategories(data.categories || []);
      } catch (err) {
        console.error("Failed to load categories:", err);
      } finally {
        setLoadingCategories(false);
      }
    }

    loadCategories();
  }, []);

  const [uploading, setUploading] = useState(false);

  async function uploadImage(e: any) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);
    if (FOLDER) formData.append("folder", FOLDER);

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await res.json();
    setUploading(false);

    if (data.secure_url) {
      setForm((prev) => ({
        ...prev,
        imageUrl: data.secure_url,
      }));
    }
  }

  async function save() {
    const token = localStorage.getItem("token");

    const parsedIngredients = ingredientsText
      .split(",")
      .map((i) => i.trim())
      .filter((i) => i.length > 0);

    const payload = {
      ...form,
      price: Math.round(Number(form.price) * 100) || 0,
      ingredients: parsedIngredients,
    };

    await fetch(`${API}/api/menu`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    reload();
    onClose();
  }

  return {
    form,
    setForm,
    ingredientsText,
    setIngredientsText: (text: string) => setIngredientsText(cleanIngredientsText(text)),
    localCategories,
    loadingCategories,
    uploading,
    uploadImage,
    fileInputRef,
    save,
  };
}
