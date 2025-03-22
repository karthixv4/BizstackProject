import { useNavigate } from "react-router-dom";

const AdminBasePage = ()=>{
    const navigate = useNavigate();

    const handleCardClick = (url)=>{
        navigate(url)
    }
    return(
        <>
        <>
            <div className="flex justify-center w-full">
                <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 max-w-7xl w-full">
                    {/* Grid */}
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                        {/* Card - Total Users */}
                        <div
                            onClick={() => handleCardClick('/all/resources')}
                            className="flex flex-col bg-white border shadow-sm rounded-xl dark:bg-neutral-800 dark:border-neutral-700 transform transition-transform duration-200 hover:scale-105 cursor-pointer"
                        >
                            <div className="p-4 md:p-5">
                                <div className="flex items-center gap-x-2">
                                    <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-neutral-500">
                                        Resource List
                                    </p>
                                </div>
                                <div className="mt-1 flex items-center gap-x-2">
                                    <h3 className="text-xl sm:text-2xl font-medium text-gray-800 dark:text-neutral-200">
                                        All Resources
                                    </h3>
                                </div>
                            </div>
                        </div>
                        {/* End Card */}

                        {/* Card - Onboard */}
                        <div
                            // onClick={() => onOpen3()}
                            className="flex flex-col bg-white border shadow-sm rounded-xl dark:bg-neutral-800 dark:border-neutral-700 transform transition-transform duration-200 hover:scale-105 cursor-pointer"
                        >
                            <div className="p-4 md:p-5">
                                <div className="flex items-center gap-x-2">
                                    <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-neutral-500">
                                        Onboard
                                    </p>
                                </div>
                                <div className="mt-1 flex items-center gap-x-2">
                                    <h3 className="text-xl sm:text-2xl font-medium text-gray-800 dark:text-neutral-200">
                                        Onboard a User
                                    </h3>
                                </div>
                            </div>
                        </div>
                        {/* End Card */}

                        {/* Card - KT Plan */}
                        <div
                            // onClick={() => onOpen()}
                            className="flex flex-col bg-white border shadow-sm rounded-xl dark:bg-neutral-800 dark:border-neutral-700 transform transition-transform duration-200 hover:scale-105 cursor-pointer"
                        >
                            <div className="p-4 md:p-5">
                                <div className="flex items-center gap-x-2">
                                    <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-neutral-500">
                                        Quick Assign
                                    </p>
                                </div>
                                <div className="mt-1 flex items-center gap-x-2">
                                    <h3 className="text-xl sm:text-2xl font-medium text-gray-800 dark:text-neutral-200">
                                        Assign KT Plan
                                    </h3>
                                </div>
                            </div>
                        </div>
                        {/* End Card */}

                        {/* Card - Action Items */}
                        <div
                            // onClick={() => onOpen2()}
                            className="flex flex-col bg-white border shadow-sm rounded-xl dark:bg-neutral-800 dark:border-neutral-700 transform transition-transform duration-200 hover:scale-105 cursor-pointer"
                        >
                            <div className="p-4 md:p-5">
                                <div className="flex items-center gap-x-2">
                                    <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-neutral-500">
                                        Quick Assign
                                    </p>
                                </div>
                                <div className="mt-1 flex items-center gap-x-2">
                                    <h3 className="text-xl sm:text-2xl font-medium text-gray-800 dark:text-neutral-200">
                                        Assign a Task
                                    </h3>
                                </div>
                            </div>
                        </div>
                        {/* End Card */}

                        {/* Card - Progress Pie Chart (Double height) */}
                        <div className="flex flex-col bg-white border shadow-sm rounded-xl dark:bg-neutral-800 dark:border-neutral-700 row-span-2 col-span-2 p-4 md:p-5">
                            <div className="flex items-center gap-x-2">
                                <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-neutral-500">
                                    Overall 
                                </p>
                            </div>
                            <div className="mt-1 flex items-center gap-x-2">
                                <h3 className="text-xl sm:text-2xl font-medium text-gray-800 dark:text-neutral-200">
                                    User Tiers
                                </h3>
                            </div>
                            <div className="mt-6">
                                {/* <ProgressPieChart /> */}
                            </div>
                        </div>
                        {/* Card - Onboarding Pie Chart (Double height) */}
                        <div className="flex flex-col bg-white border shadow-sm rounded-xl dark:bg-neutral-800 dark:border-neutral-700 row-span-2 col-span-2 p-4 md:p-5">
                            <div className="flex items-center gap-x-2">
                                <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-neutral-500">
                                    Overall 
                                </p>
                            </div>
                            <div className="mt-1 flex items-center gap-x-2">
                                <h3 className="text-xl sm:text-2xl font-medium text-gray-800 dark:text-neutral-200">
                                    Onboarding Status
                                </h3>
                            </div>
                            <div className="mt-6">
                                {/* <OnboardingTracker /> */}
                            </div>
                        </div>
                        {/* End Card */}
                    </div>
                    {/* End Grid */}
                </div>
            </div>
            {/* <OnboardUser isOpen={isOpen3} onClose={onClose3} />
            <AssignKT isOpen={isOpen} onClose={onClose} dataObject={{ fromTable: false, item: null }} />
            <AssignActionItem isOpen={isOpen2} onClose={onClose2} dataObject={{ fromTable: false, item: null }} /> */}
        </>
        </>
    )
}

export default AdminBasePage