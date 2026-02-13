const Register = () => {
    // ... State for username, email, password
    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await registerCustomer(formData);
            toast.success("Account created! You can now login.");
            navigate('/login');
        } catch (err) {
            toast.error("Registration failed.");
        }
    };
    // ... UI similar to Login but with extra fields ...
};

export default Register;