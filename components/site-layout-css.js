// Header / mobile-menu styles from the original views/layout.ejs
const css = String.raw`
        :root {
            --primary: #00486c;
            --gold: #8B7355;
            --text: #ffffff;
            --text-light: rgba(255,255,255,0.8);
        }

        /* ======================= YOUR ORIGINAL HEADER STYLES (unchanged) ======================= */
        header {
            position: fixed;
            width: auto;
            left: 0;
            right: 0;
            display: block;
            padding-top: 0;
            z-index: 9999;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            transition: all 0.5s;
        }
        header.sticked {
            background-color: var(--primary);
            border-color: transparent;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
        }
        @media (min-width: 992px) {
            header.sticked nav.navigation-top { margin-top: -50px; }
            header.sticked nav.navigation-main .logo {
                bottom: -35px;
                border-radius: 100%;
                background-color: var(--primary);
                width: 90px;
                height: 93px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
            }
        }

        /* ======================= FIXED NAVIGATION AND MOBILE PADDING ======================= */
        
        /* Desktop Navigation Styles */
        @media (min-width: 992px) {
            .navigation-block {
                display: flex !important;
                justify-content: space-between;
                align-items: center;
                width: 100%;
            }
            
            .navigation-left, .navigation-right {
                display: flex;
                list-style: none;
                margin: 0;
                padding: 0;
                align-items: center;
            }
            
            .navigation-left li, .navigation-right li {
                margin: 0 15px;
                position: relative;
            }
            
            .navigation-left a, .navigation-right a {
                color: white;
                text-decoration: none;
                font-family: 'Montserrat', sans-serif;
                font-weight: 500;
                font-size: 16px;
                padding: 10px 0;
                transition: color 0.3s ease;
            }
            
            .navigation-left a:hover, .navigation-right a:hover {
                color: var(--gold);
            }
            
            /* Dropdown styles for desktop */
            .navigation-left li ul {
                position: absolute;
                top: 100%;
                left: 0;
                background: var(--primary);
                min-width: 200px;
                box-shadow: 0 5px 15px rgba(0,0,0,0.3);
                opacity: 0;
                visibility: hidden;
                transform: translateY(10px);
                transition: all 0.3s ease;
                list-style: none;
                padding: 10px 0;
                z-index: 100;
            }
            
            .navigation-left li:hover ul {
                opacity: 1;
                visibility: visible;
                transform: translateY(0);
            }
            
            .navigation-left li ul li {
                margin: 0;
                border-bottom: 1px solid rgba(255,255,255,0.1);
            }
            
            .navigation-left li ul li:last-child {
                border-bottom: none;
            }
            
            .navigation-left li ul li a {
                padding: 12px 20px;
                display: block;
                white-space: nowrap;
                font-size: 14px;
            }
            
            .navigation-left li ul li a:hover {
                background: rgba(255,255,255,0.1);
            }
            
            .open-dropdown {
                margin-left: 5px;
                font-size: 14px;
            }
            
            .mobile-menu-header,
            .mobile-menu-close,
            .mobile-overlay {
                display: none !important;
            }
        }

        /* Mobile Navigation Styles */
        /* Mobile Navigation Styles */
@media (max-width: 991px) {
    .navigation-top { 
        display: none !important; 
    }

    /* WHITE BACKGROUND for mobile navigation */
    .navigation-main {
        background-color: #ffffff !important;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }

    /* Fix for double logo issue */
    .mobile-menu-logo {
        display: none !important;
    }

    /* Added top padding for mobile header */
    header {
        padding-top: 0;
        padding-bottom: 0;
    }
    
    .navigation-main {
        position: relative;
        min-height: 70px; /* Increased height for better spacing */
        display: flex;
        align-items: center;
        padding: 15px 0; /* Increased padding for better spacing */
    }

    /* PERFECTLY ALIGNED HAMBURGER WITH LOGO */
    .toggle-menu {
        color: #333333 !important; /* Dark color for white background */
        position: absolute;
        right: 15px;
        top: 50%;
        transform: translateY(-50%);
        z-index: 10001;
        background: none;
        border: none;
        padding: 8px; /* Adjusted padding */
        margin: 0;
        margin-top: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 40px; /* Fixed height for consistent alignment */
        
    }
    .toggle-menu i { 
        font-size: 24px; 
        line-height: 1; /* Ensure icon doesn't have extra line height */
    }

    /* Main logo positioning with proper padding */
    .navigation-main .logo {
        position: relative;
        z-index: 10001;
        padding: 0;
        display: flex;
        align-items: center;
        height: 40px; /* Match hamburger height for perfect alignment */
    }
    .logo-mobile {
        height: 35px;
        display: block;
    }
    .logo-desktop {
        display: none;
    }

    /* Rest of your mobile styles remain the same */
    .navigation-block {
        position: fixed;
        top: 0;
        left: 0;
        width: 320px;
        max-width: 85%;
        height: 100vh;
        background: var(--primary);
        z-index: 9999;
        transform: translateX(-100%);
        transition: transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
        overflow-y: auto;
        padding-top: 80px;
        box-shadow: 5px 0 20px rgba(0,0,0,0.4);
    }
    .navigation-block.open {
        transform: translateX(0);
    }

    /* Mobile menu header */
    .mobile-menu-header {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 80px;
        background: rgba(0,0,0,0.2);
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 20px;
        border-bottom: 1px solid rgba(255,255,255,0.1);
    }

    .mobile-menu-logo-new {
        display: block !important;
    }
    .mobile-menu-logo-new img {
        height: 35px;
    }

    /* Close button */
    .mobile-menu-close {
        width: 40px;
        height: 40px;
        background: var(--gold);
        color: white;
        border: none;
        border-radius: 50%;
        font-size: 18px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 15px rgba(139,115,85,0.4);
        transition: all 0.3s ease;
    }
    .mobile-menu-close:hover {
        background: #9a7f5f;
        transform: scale(1.05);
    }

    /* Menu items */
    .navigation-block ul {
        padding: 30px 0;
        margin: 0;
    }
    
    .navigation-block .navigation-left,
    .navigation-block .navigation-right {
        flex-direction: column;
        width: 100%;
    }
    
    .navigation-block .navigation-right {
        border-top: 1px solid #006a9f;
    }
    
    .navigation-block ul li {
        border-top: 1px solid #006a9f;
    }
    .navigation-block ul li:first-child {
        border-top: none;
    }
    .navigation-block ul li a {
        color: white;
        padding: 18px 25px;
        font-family: 'Montserrat', sans-serif;
        font-size: 16px;
        font-weight: 500;
        text-transform: none;
        display: flex;
        justify-content: space-between;
        align-items: center;
        transition: all 0.3s;
        text-decoration: none;
    }
    .navigation-block ul li a:hover {
        background: rgba(255,255,255,0.08);
        color: var(--gold);
    }

    /* Dropdown arrow */
    .open-dropdown {
        font-size: 20px !important;
        transition: transform 0.3s;
        margin-left: 10px;
    }
    .navigation-block ul li.expanded .open-dropdown i {
        transform: rotate(180deg);
    }

    /* Submenu */
    .navigation-block ul li > ul {
        background: rgba(0,0,0,0.2);
        display: none;
        padding: 0;
    }
    .navigation-block ul li.expanded > ul {
        display: block;
    }
    .navigation-block ul li > ul li a {
        font-family: 'Montserrat', sans-serif;
        font-size: 14px;
        font-weight: 400;
        padding: 14px 40px;
        color: var(--text-light);
    }
    .navigation-block ul li > ul li a:hover {
        color: var(--gold);
        background: rgba(255,255,255,0.05);
    }

    /* Overlay */
    .mobile-overlay {
        position: fixed;
        top: 0; left: 0;
        width: 100%; height: 100%;
        background: rgba(0,0,0,0.7);
        z-index: 9998;
        opacity: 0;
        visibility: hidden;
        transition: all 0.4s;
    }
    .mobile-overlay.active {
        opacity: 1;
        visibility: visible;
    }

    body.menu-open { 
        overflow: hidden; 
    }
}
`;
export default css;
