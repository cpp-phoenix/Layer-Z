import { NavLink as Link } from 'react-router-dom';

function Navbar({selected}) {
    return (
        <div className="w-[380px] px-4 bg-[#f8fafc]">
            <div className="flex flex-col justify-between h-full">
                <div className="flex items-center h-[230px] border-b px-3 py-2">
                    <div className="w-full space-y-4">
                        <div className="flex space-x-2 items-center">
                            <img alt="logo" className="w-10 h-10" src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Abyss_of_regular_octagons.svg/1200px-Abyss_of_regular_octagons.svg.png" />
                            <div className="font-semibold text-4xl">abyss</div>
                        </div>
                        <div className="flex p-1 space-x-6">
                            <div className="rounded-lg w-[80px] h-[80px] bg-white">QR</div>
                            <div className="space-y-2">
                                <div className="font-medium text-sm text-[#64748B]">Abyss Wallet</div>
                                <div className="text-[#94A3B8] font-bold">123123213123</div>
                                <div className="text-[#64748B]">explorer</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='h-full'>
                    <div className="pt-10 font-medium px-3 space-y-12">
                        <Link to="/" className={`flex items-center space-x-3 ${selected === "Home" ? "text-[#07A65D]" : "text-[#94A3B8]"}`}>
                            <svg width="20" height="20" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6"><g clip-path="url(#home_svg__clip0_7394_273089)"><path d="M5.79941 11.6669H10.1994M1.39941 9.90691V8.09568C1.39941 7.25329 1.39941 6.8321 1.50799 6.44421C1.60416 6.10062 1.76222 5.77745 1.97439 5.49059C2.21391 5.16675 2.54638 4.90816 3.21132 4.39099L5.11799 2.90802C6.14854 2.10648 6.66382 1.70571 7.2328 1.55166C7.73484 1.41572 8.26399 1.41572 8.76603 1.55166C9.33501 1.70571 9.85029 2.10648 10.8808 2.90802L12.7875 4.39099C13.4525 4.90816 13.7849 5.16675 14.0244 5.49059C14.2366 5.77745 14.3947 6.10062 14.4908 6.44421C14.5994 6.8321 14.5994 7.25329 14.5994 8.09568V9.90691C14.5994 11.5497 14.5994 12.3711 14.2797 12.9986C13.9985 13.5506 13.5497 13.9993 12.9978 14.2805C12.3703 14.6002 11.5489 14.6002 9.90608 14.6002H6.09275C4.44993 14.6002 3.62852 14.6002 3.00104 14.2805C2.4491 13.9993 2.00036 13.5506 1.71913 12.9986C1.39941 12.3711 1.39941 11.5497 1.39941 9.90691Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></g><defs><clipPath id="home_svg__clip0_7394_273089"><rect width="16" height="16" fill="white"></rect></clipPath></defs></svg>
                            <div className="text-xl">Home</div>
                        </Link>
                        <Link to="/dapps" className={`flex items-center space-x-3 ${selected === "Dapps" ? "text-[#07A65D]" : "text-[#94A3B8]"}`}>
                            <svg width="18" height="20" viewBox="0 0 18 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6"><path d="M10.8694 6.67132C10.9456 7.38373 11.5186 7.95672 12.2307 8.03609C12.7596 8.09504 13.3026 8.14568 13.8563 8.14568C14.41 8.14568 14.953 8.09504 15.4819 8.03609C16.194 7.95672 16.7669 7.38373 16.8432 6.67132C16.8994 6.14541 16.9469 5.60548 16.9469 5.05501C16.9469 4.50455 16.8994 3.96462 16.8432 3.43871C16.7669 2.7263 16.194 2.15331 15.4819 2.07394C14.953 2.01499 14.41 1.96436 13.8563 1.96436C13.3026 1.96436 12.7596 2.01499 12.2307 2.07394C11.5186 2.15331 10.9456 2.7263 10.8694 3.43871C10.8131 3.96462 10.7656 4.50455 10.7656 5.05501C10.7656 5.60548 10.8131 6.14541 10.8694 6.67132Z" stroke="currentColor" stroke-width="2"></path><path d="M1.15847 6.67132C1.23469 7.38373 1.80767 7.95672 2.51974 8.03609C3.04864 8.09504 3.59168 8.14568 4.14535 8.14568C4.69901 8.14568 5.24206 8.09504 5.77096 8.03609C6.48302 7.95672 7.05601 7.38373 7.13223 6.67132C7.18849 6.14541 7.23601 5.60548 7.23601 5.05501C7.23601 4.50455 7.18849 3.96462 7.13223 3.43871C7.05601 2.7263 6.48302 2.15331 5.77096 2.07394C5.24206 2.01499 4.69901 1.96436 4.14535 1.96436C3.59168 1.96436 3.04864 2.01499 2.51974 2.07394C1.80767 2.15331 1.23469 2.7263 1.15847 3.43871C1.1022 3.96462 1.05469 4.50455 1.05469 5.05501C1.05469 5.60548 1.1022 6.14541 1.15847 6.67132Z" fill="currentColor" stroke="currentColor" stroke-width="2"></path><path d="M1.15847 16.5615C1.23469 17.2739 1.80767 17.8469 2.51974 17.9262C3.04864 17.9852 3.59168 18.0358 4.14535 18.0358C4.69901 18.0358 5.24206 17.9852 5.77096 17.9262C6.48302 17.8469 7.05601 17.2739 7.13223 16.5615C7.18849 16.0355 7.23601 15.4956 7.23601 14.9452C7.23601 14.3947 7.18849 13.8548 7.13223 13.3288C7.05601 12.6164 6.48302 12.0434 5.77096 11.9641C5.24206 11.9051 4.69901 11.8545 4.14535 11.8545C3.59168 11.8545 3.04864 11.9051 2.51974 11.9641C1.80767 12.0434 1.23469 12.6164 1.15847 13.3288C1.1022 13.8548 1.05469 14.3947 1.05469 14.9452C1.05469 15.4956 1.1022 16.0355 1.15847 16.5615Z" stroke="currentColor" stroke-width="2"></path><path d="M10.8694 16.5615C10.9456 17.2739 11.5186 17.8469 12.2307 17.9262C12.7596 17.9852 13.3026 18.0358 13.8563 18.0358C14.41 18.0358 14.953 17.9852 15.4819 17.9262C16.194 17.8469 16.7669 17.2739 16.8432 16.5615C16.8994 16.0355 16.9469 15.4956 16.9469 14.9452C16.9469 14.3947 16.8994 13.8548 16.8432 13.3288C16.7669 12.6164 16.194 12.0434 15.4819 11.9641C14.953 11.9051 14.41 11.8545 13.8563 11.8545C13.3026 11.8545 12.7596 11.9051 12.2307 11.9641C11.5186 12.0434 10.9456 12.6164 10.8694 13.3288C10.8131 13.8548 10.7656 14.3947 10.7656 14.9452C10.7656 15.4956 10.8131 16.0355 10.8694 16.5615Z" fill="currentColor" stroke="currentColor" stroke-width="2"></path></svg>
                            <div className="text-xl">Dapps</div>
                        </Link>
                        <Link to="/txns" className={`flex items-center space-x-3 ${selected === "Transactions" ? "text-[#07A65D]" : "text-[#94A3B8]"}`}>
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6"><path d="M6.6886 1L6.6886 4.6564" stroke="currentColor" stroke-width="2" stroke-linecap="round"></path><path d="M13.3014 1L13.3014 4.6564" stroke="currentColor" stroke-width="2" stroke-linecap="round"></path><path d="M18.3549 9.43079L1.64512 9.43078L1.87968 3.62074L9.90152 3.05234L18.355 3.62074L18.3549 9.43079Z" fill="currentColor"></path><path d="M1.22919 14.5151C1.48646 16.9147 3.45528 18.8149 5.86654 18.9159C7.18793 18.9713 8.54289 19 10 19C11.4571 19 12.8121 18.9713 14.1335 18.9159C16.5447 18.8149 18.5135 16.9147 18.7708 14.5151C18.9013 13.2975 19 12.0544 19 10.7912C19 9.52805 18.9013 8.28494 18.7708 7.06743C18.5135 4.66781 16.5447 2.7676 14.1335 2.66655C12.8121 2.61118 11.4571 2.58252 10 2.58252C8.5429 2.58252 7.18793 2.61118 5.86654 2.66655C3.45528 2.7676 1.48646 4.66781 1.22919 7.06743C1.09866 8.28494 1 9.52805 1 10.7912C1 12.0544 1.09866 13.2975 1.22919 14.5151Z" stroke="currentColor" stroke-width="2"></path><path d="M1.43066 8.88342H18.658" stroke="currentColor" stroke-width="2"></path></svg>
                            <div className="text-xl">Transactions</div>
                        </Link>
                    </div>
                </div>
                <div className="flex items-center justify-center border-t h-[50px] px-3 font-medium text-[#64748B]">
                    
                </div>
            </div>
        </div>
    )
}

export default Navbar;