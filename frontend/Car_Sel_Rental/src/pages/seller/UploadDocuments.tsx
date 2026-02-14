import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaFileInvoice, FaShieldAlt, FaCloudUploadAlt } from "react-icons/fa";
import api from "../../api/api";
import toast from "react-hot-toast";

const UploadDocuments = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [docs, setDocs] = useState<{ rc?: File; insurance?: File }>({});

    const handleUpload = async () => {
        const formData = new FormData();
        if (docs.rc) formData.append("registration_certificate", docs.rc);
        if (docs.insurance) formData.append("insurance_policy", docs.insurance);

        try {
            await api.patch(`/cars/${id}/upload_docs/`, formData);
            toast.success("Documents uploaded for verification!");
            navigate("/seller/inventory");
        }
        catch (err) {
            toast.error("Upload failed");
        }
    };

    return (
        <div className="max-w-2xl mx-auto py-20 px-6">
            <h1 className="text-3xl font-black dark:text-white mb-8">Verification <span className="text-cyan-500">Vault</span></h1>
            <div className="space-y-6">
                <DocInput 
                    icon={<FaFileInvoice />} 
                    title="Registration Certificate (RC)" 
                    onChange={(file) => setDocs({...docs, rc: file})} 
                />
                <DocInput 
                    icon={<FaShieldAlt />} 
                    title="Insurance Policy" 
                    onChange={(file) => setDocs({...docs, insurance: file})} 
                />
                <button onClick={handleUpload} className="w-full py-4 bg-emerald-500 text-white font-black rounded-2xl hover:bg-emerald-600 transition-all">
                    SUBMIT FOR REVIEW
                </button>
            </div>
        </div>
    );
};

const DocInput = ({ icon, title, onChange }: any) => (
    <div className="p-8 border-2 border-dashed border-slate-200 dark:border-white/10 rounded-[2.5rem] bg-white dark:bg-slate-900 flex flex-col items-center text-center group hover:border-cyan-500 transition-all">
        <div className="text-3xl text-slate-400 group-hover:text-cyan-500 mb-4">{icon}</div>
        <p className="font-bold dark:text-white mb-2">{title}</p>
        <input type="file" className="hidden" id={title} onChange={(e) => onChange(e.target.files?.[0])} />
        <label htmlFor={title} className="cursor-pointer text-xs font-black uppercase text-cyan-500 hover:underline">Choose File</label>
    </div>
);

export default UploadDocuments;