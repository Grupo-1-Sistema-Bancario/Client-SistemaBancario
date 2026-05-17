import { useEffect } from "react";

import { useAccountsStore } from "../store/useAccountsStore";

import { StatCard } from "../components/StatCard";

export const AccountsStatsPage = () => {

    const {
        accounts,
        getAccounts
    } = useAccountsStore();

    useEffect(() => {
        getAccounts();
    }, []);

    // STATS

    const totalAccounts = accounts.length;

    const activeAccounts =
        accounts.filter(acc => acc.isActive).length;

    const blockedAccounts =
        accounts.filter(acc => !acc.isActive).length;

    const totalBalance =
        accounts.reduce((acc, item) =>
            acc + item.balance, 0
        );

    const avgIncome =
        totalAccounts > 0
            ? (
                accounts.reduce((acc, item) =>
                    acc + item.monthlyIncome, 0
                ) / totalAccounts
            ).toFixed(2)
            : 0;

    return (

        <div className="
            min-h-screen
            p-8
            bg-[radial-gradient(circle_at_top,#1A1038,#05010D)]
        ">

            {/* HEADER */}

            <div className="mb-12">

                <h1 className="
                    text-5xl
                    font-black
                    uppercase
                    italic
                    tracking-tight
                    text-transparent
                    bg-clip-text
                    bg-gradient-to-r
                    from-cyan-400
                    to-fuchsia-500
                ">
                    Account Statistics
                </h1>

                <p className="
                    text-cyan-400/50
                    uppercase
                    tracking-[0.4em]
                    text-xs
                    mt-3
                    font-mono
                ">
                    Astra Bank Analytics Nexus
                </p>

            </div>

            {/* GRID */}

            <div className="
                grid
                grid-cols-1
                md:grid-cols-2
                xl:grid-cols-4
                gap-8
            ">

                <StatCard
                    title="Total Accounts"
                    value={totalAccounts}
                    icon="🌌"
                    glow="from-cyan-500 to-blue-600"
                />

                <StatCard
                    title="Active Accounts"
                    value={activeAccounts}
                    icon="🟢"
                    glow="from-emerald-500 to-cyan-500"
                />

                <StatCard
                    title="Blocked Accounts"
                    value={blockedAccounts}
                    icon="🔒"
                    glow="from-red-500 to-pink-600"
                />

                <StatCard
                    title="Bank Balance"
                    value={`Q ${totalBalance.toLocaleString()}`}
                    icon="💰"
                    glow="from-fuchsia-500 to-purple-700"
                />

            </div>

            {/* EXTRA PANELS */}

            <div className="
                grid
                grid-cols-1
                xl:grid-cols-2
                gap-8
                mt-10
            ">

                {/* AVG INCOME */}

                <div className="
                    rounded-3xl
                    border border-cyan-500/10
                    bg-[#0D0618]/80
                    backdrop-blur-xl
                    p-8
                ">

                    <h2 className="
                        text-2xl
                        font-black
                        uppercase
                        text-white
                    ">
                        Monthly Income Average
                    </h2>

                    <p className="
                        text-purple-400/50
                        uppercase
                        tracking-[0.3em]
                        text-xs
                        mt-2
                        font-mono
                    ">
                        Financial Analytics
                    </p>

                    <div className="mt-10">

                        <h1 className="
                            text-6xl
                            font-black
                            text-transparent
                            bg-clip-text
                            bg-gradient-to-r
                            from-cyan-400
                            to-fuchsia-500
                        ">
                            Q {avgIncome}
                        </h1>

                    </div>

                </div>

                {/* RECENT ACCOUNTS */}

                <div className="
                    rounded-3xl
                    border border-fuchsia-500/10
                    bg-[#0D0618]/80
                    backdrop-blur-xl
                    p-8
                ">

                    <h2 className="
                        text-2xl
                        font-black
                        uppercase
                        text-white
                    ">
                        Recent Accounts
                    </h2>

                    <div className="space-y-4 mt-8">

                        {accounts
                            .slice(-5)
                            .reverse()
                            .map((account) => (

                                <div
                                    key={account._id}
                                    className="
                                        flex justify-between items-center
                                        p-4 rounded-2xl
                                        border border-white/5
                                        bg-white/5
                                    "
                                >

                                    <div>

                                        <p className="
                                            text-white font-bold
                                        ">
                                            {account.accountNumber}
                                        </p>

                                        <p className="
                                            text-cyan-400/50
                                            text-xs font-mono
                                        ">
                                            {account.jobName}
                                        </p>

                                    </div>

                                    <div className={`
                                        px-3 py-1 rounded-full
                                        text-[10px]
                                        uppercase
                                        tracking-widest
                                        border
                                        ${account.isActive
                                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                            : 'bg-red-500/10 text-red-400 border-red-500/20'
                                        }
                                    `}>

                                        {account.isActive
                                            ? 'ACTIVE'
                                            : 'BLOCKED'
                                        }

                                    </div>

                                </div>

                            ))}

                    </div>

                </div>

            </div>

        </div>

    );

};