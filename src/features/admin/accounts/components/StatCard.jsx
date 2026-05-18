export const StatCard = ({
    title,
    value,
    icon,
    glow = "from-cyan-500 to-fuchsia-600"
}) => {

    return (

        <div className="
            relative overflow-hidden
            rounded-3xl
            border border-white/10
            bg-[#0D0618]/80
            backdrop-blur-xl
            p-6
            transition-all
            hover:scale-[1.02]
            hover:border-fuchsia-500/30
            hover:shadow-[0_0_40px_rgba(217,70,239,0.18)]
        ">

            {/* Glow */}
            <div className={`
                absolute inset-0 opacity-10
                bg-gradient-to-br ${glow}
            `}></div>

            <div className="relative z-10">

                <div className="flex justify-between items-center">

                    <div>

                        <p className="
                            text-[10px]
                            uppercase
                            tracking-[0.3em]
                            text-cyan-400
                            font-mono
                        ">
                            {title}
                        </p>

                        <h2 className="
                            text-4xl
                            font-black
                            text-white
                            mt-3
                        ">
                            {value}
                        </h2>

                    </div>

                    <div className="
                        w-16 h-16 rounded-2xl
                        border border-white/10
                        bg-white/5
                        flex items-center justify-center
                        text-3xl
                    ">
                        {icon}
                    </div>

                </div>

            </div>

        </div>

    );

};