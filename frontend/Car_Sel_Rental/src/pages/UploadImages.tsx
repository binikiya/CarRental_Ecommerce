import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/api";
import { FaCloudUploadAlt, FaTrash } from "react-icons/fa";

const UploadImages = () => {
    const { carId } = useParams();
    const navigate = useNavigate();
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);
    const [uploading, setUploading] = useState(false);
    const [primaryIndex, setPrimaryIndex] = useState(0);
    const [uploadProgress, setUploadProgress] = useState(0);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const filesArray = Array.from(e.target.files);
            setSelectedFiles((prev) => [...prev, ...filesArray]);

            const newPreviews = filesArray.map((file) => URL.createObjectURL(file));
            setPreviews((prev) => [...prev, ...newPreviews]);
        }
    };

    const removeImage = (index: number) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
        setPreviews(prev => prev.filter((_, i) => i !== index));
    };

    const handleUpload = async () => {
        setUploading(true);
        setUploadProgress(0);
        
        try {
            for (let i = 0; i < selectedFiles.length; i++) {
                const formData = new FormData();
                formData.append("car", carId!);
                formData.append("image_file", selectedFiles[i]);
                formData.append("is_primary", (i === primaryIndex).toString());

                await api.post("/cars/car-image/", formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                    onUploadProgress: (progressEvent) => {
                        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total!);
                        const totalProgress = Math.round(((i / selectedFiles.length) * 100) + (percentCompleted / selectedFiles.length));
                        setUploadProgress(totalProgress);
                    }
                });
            }
            navigate("/seller/dashboard");
        } catch (error) {
            console.error("Upload failed", error);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto py-12 px-6 mt-10">
            <h1 className="text-3xl font-black dark:text-white mb-8">Upload <span className="text-cyan-500">Photos</span></h1>
            
            <div className="bg-white dark:bg-slate-900 p-8 rounded-4xl border border-dashed border-slate-300 dark:border-white/10 text-center">
                <input type="file" multiple onChange={handleFileChange} className="hidden" id="fileInput" accept="image/*" />
                <label htmlFor="fileInput" className="cursor-pointer flex flex-col items-center">
                    <FaCloudUploadAlt size={48} className="text-cyan-500 mb-4" />
                    <span className="text-lg font-bold dark:text-white">Click to select car images</span>
                    <span className="text-sm text-slate-500">PNG, JPG or WEBP (Max 5MB each)</span>
                </label>
            </div>

            {/* Preview Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                {previews.map((url, index) => (
                    <div key={index} className="relative group rounded-2xl overflow-hidden h-40 border-2 border-slate-200 dark:border-white/5">
                        <img src={url} className="w-full h-full object-cover" />
                        <button onClick={() => removeImage(index)} className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                            <FaTrash size={12} />
                        </button>
                        <button 
                            onClick={() => setPrimaryIndex(index)}
                            className={`absolute bottom-2 left-2 px-2 py-1 rounded-md text-[10px] font-bold uppercase transition-all ${
                                primaryIndex === index ? "bg-cyan-500 text-slate-900" : "bg-black/50 text-white backdrop-blur-md"
                            }`}
                        >
                            {primaryIndex === index ? "Primary Image" : "Set as Primary"}
                        </button>
                    </div>
                ))}
            </div>

            {selectedFiles.length > 0 && (
                <button onClick={handleUpload} disabled={uploading} className="w-full mt-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-2xl hover:bg-cyan-500 transition-all flex justify-center items-center gap-2">
                    {uploading ? `Uploading ${uploadProgress}%` : "Publish Listing"}
                </button>
            )}
        </div>
    );
};

export default UploadImages;