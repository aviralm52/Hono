import axios from "axios";
import { useToast } from "./hooks/use-toast";
import { Toaster } from "./components/ui/toaster";
import { useEffect, useState } from "react";
import { MoonStar, Sun } from "lucide-react";

function App() {
    const { toast } = useToast();
    const [isDark, setIsDark] = useState(false);

    const callHomePageAPI = async () => {
        try {
            const response = await axios.get("http://localhost:3000/");
            console.log(response.data);
        } catch (err) {
            console.log("err: ", err);
            toast({
                title: "API error",
                description: `${(err as any).message}`,
                variant: "destructive",
            });
        }
    };

    useEffect(() => {
        setIsDark(() => localStorage.getItem("theme") === "dark");
        document.documentElement.classList.add(isDark ? "dark" : "light");
        callHomePageAPI();
    }, []);

    const toggleDark = () => {
        document.documentElement.classList.toggle("dark");
        const isDark = document.documentElement.classList.contains("dark");
        localStorage.setItem("theme", isDark ? "dark" : "light");
        setIsDark(isDark);
    };

    return (
        <div className=" h-screen w-screen flex dark:bg-[#1E1E20]">
            <Toaster />
            <div className=" w-1/3 h-full hidden sm:block">
                {" "}
                <video
                    src="/home-video.mp4"
                    autoPlay
                    loop
                    className=" h-full object-cover"
                >
                    Your browser does not support the video tag.
                </video>
            </div>
            <div className=" w-2/3 p-4">
                <nav className=" flex items-start justify-between w-full">
                    <div className=" flex flex-col items-center">
                        <img src="/hono-logo.png" className=" w-36 h-36" />
                        <p className=" text-5xl font-semibold font-lacquer">
                            HONO.js
                        </p>
                    </div>
                    <div className="">
                        {isDark ? (
                            <Sun
                                size={36}
                                onClick={toggleDark}
                                className=" cursor-pointer"
                            />
                        ) : (
                            <MoonStar
                                size={36}
                                onClick={toggleDark}
                                className=" cursor-pointer"
                            />
                        )}
                    </div>
                </nav>
            </div>
        </div>
    );
}

export default App;
