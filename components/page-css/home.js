// Page styles carried over from the original EJS view
const css = String.raw`
/* ======================= CSS VARIABLES ======================= */
    :root {
        --primary: #00486c;     /* Your hotel's primary blue color */
        --gold: #8B7355;        /* Your hotel's gold color */
    }

    

    /* ======================= EXISTING STYLES (Keep these) ======================= */
    .guests {
        position: relative;
    }
    .guests .guest-list {
        display: none !important;
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: #fff;
        border: 1px solid #ddd;
        border-top: none;
        z-index: 9999 !important;
        box-shadow: 0 10px 20px rgba(0,0,0,0.1);
        border-radius: 0 0 4px 4px;
        max-height: 300px;
        overflow-y: auto;
    }
    .guests .guest-list.open {
        display: block !important;
    }
    .guests .result {
        cursor: pointer;
    }
    .qty-apply, .qty-close {
        cursor: pointer;
        float: right;
        padding: 12px 15px;
        font-size: 18px;
        color: #666;
    }
    .qty-apply:hover, .qty-close:hover {
        color: #333;
    }
    .guest-list .header {
        background: #f8f8f8;
        padding: 15px;
        border-bottom: 1px solid #eee;
        font-weight: 600;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .date-value {
        opacity: 0.6;
        transition: opacity 0.3s;
    }
    .date-value.filled {
        opacity: 1;
        font-weight: 500;
    }
    .guest-list li.clearfix {
        padding: 15px;
        border-bottom: 1px solid #f0f0f0;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    .guest-list li.clearfix:last-child {
        border-bottom: none;
    }
    .guest-list li.clearfix > div:first-child {
        flex: 0 0 60px;
    }
    .guest-list li.clearfix > div:nth-child(2) {
        flex: 1;
        margin-left: 15px;
    }
    .guest-list li.clearfix > div:last-child {
        flex: 0 0 auto;
        display: flex;
        gap: 5px;
    }
    .guest-list .qty-amount {
        font-size: 24px;
        font-weight: bold;
        text-align: center;
        width: 60px;
        border: none;
        background: none;
    }
    .guest-list .qty-btn {
        background: #f8f8f8;
        border: 1px solid #ddd;
        padding: 8px 12px;
        cursor: pointer;
        font-size: 18px;
        font-weight: bold;
        width: 40px;
        height: 40px;
        border-radius: 4px;
    }
    .guest-list .qty-btn:hover {
        background: #e8e8e8;
    }
    .guest-list .qty-btn:active {
        background: #ddd;
    }
    .guest-list .qty-btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }     
    
    /* ======================= SUBSCRIPTION STYLES (FIXED) ======================= */
    .subscribe {
        background-color: #00486c; /* Using direct color instead of var() for safety */
        padding: 60px 0;
        text-align: center;
        color: white;
    }

    .subscribe .box {
        max-width: 600px;
        margin: 0 auto;
    }

    .subscribe .title {
        color: white;
        font-family: 'Playfair Display', serif;
        font-size: 36px;
        margin-bottom: 15px;
        font-weight: 700;
    }

    .subscribe .text p {
        color: rgba(255, 255, 255, 0.9);
        font-size: 18px;
        margin-bottom: 30px;
        font-family: 'Montserrat', sans-serif;
    }

    .subscribe .form-group {
        margin-bottom: 0;
    }

    .subscribe .input-group {
        display: flex;
        flex-wrap: nowrap;
        box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
        border-radius: 4px;
        overflow: hidden;
    }

    .subscribe .form-control {
        height: 52px;
        border: none;
        padding: 15px 20px;
        font-size: 16px;
        font-family: 'Montserrat', sans-serif;
        border-radius: 0;
        flex-grow: 1;
        color: #333; /* Ensure text is visible */
    }

    .subscribe .form-control:focus {
        box-shadow: none;
        outline: none;
    }

    .subscribe .btn-main {
        background-color: #8B7355 !important; /* Using !important to override Bootstrap */
        border-color: #8B7355 !important;
        color: white !important;
        height: 52px;
        padding: 0 30px !important;
        font-size: 16px !important;
        font-weight: 600 !important;
        font-family: 'Montserrat', sans-serif !important;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        border-radius: 0 !important;
        transition: all 0.3s ease;
        white-space: nowrap;
        display: flex !important;
        align-items: center;
        justify-content: center;
    }

    .subscribe .btn-main:hover {
        background-color: #9a7f5f !important;
        border-color: #9a7f5f !important;
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(139, 115, 85, 0.4);
    }

    .subscribe .btn-main:active {
        transform: translateY(0);
    }

    .subscribe .btn-main:disabled {
        background-color: #cccccc !important;
        border-color: #cccccc !important;
        cursor: not-allowed;
        transform: none;
        box-shadow: none;
    }

    /* Message Styles */
    #newsletterMessage {
        border-radius: 4px;
        padding: 15px;
        font-family: 'Montserrat', sans-serif;
        font-size: 14px;
        text-align: center;
        animation: fadeIn 0.3s ease;
        display: none; /* Start hidden */
    }

    #newsletterMessage .alert {
        margin: 0;
        padding: 10px 15px;
    }

    #newsletterMessage.success .alert {
        background-color: rgba(40, 167, 69, 0.1);
        color: #28a745;
        border: 1px solid rgba(40, 167, 69, 0.2);
    }

    #newsletterMessage.error .alert {
        background-color: rgba(220, 53, 69, 0.1);
        color: #dc3545;
        border: 1px solid rgba(220, 53, 69, 0.2);
    }

    

    /* Validation Styles */
    .subscribe .form-control.is-invalid {
        border: 2px solid #dc3545 !important;
    }

    .subscribe .form-control.is-valid {
        border: 2px solid #28a745 !important;
    }

    /* Spinner for loading state */
    .spinner-border-sm {
        width: 1rem;
        height: 1rem;
        border-width: 0.2em;
    }

    /* Simplified Subscription Form Styles */
.newsletter-form {
    max-width: 500px;
    margin: 0 auto;
}

.subscribe-form-group {
    display: flex;
    margin-bottom: 10px;
}

.email-input-wrapper {
    flex: 1;
}

.subscribe-email {
    width: 100%;
    height: 52px;
    padding: 0 20px;
    border: none;
    font-size: 16px;
    font-family: 'Montserrat', sans-serif;
    border-radius: 4px 0 0 4px;
    color: #333;
}

.subscribe-btn {
    background: #8B7355;
    color: white;
    border: none;
    padding: 0 30px;
    font-size: 16px;
    font-weight: 600;
    font-family: 'Montserrat', sans-serif;
    cursor: pointer;
    border-radius: 0 4px 4px 0;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 120px;
    height: 52px;
}

.subscribe-btn:hover {
    background: #9a7f5f;
    transform: translateY(-2px);
}

.subscribe-btn:disabled {
    background: #cccccc;
    cursor: not-allowed;
    transform: none;
}

.subscribe-note {
    color: rgba(255, 255, 255, 0.7);
    font-size: 12px;
    text-align: center;
    margin-top: 10px;
    font-family: 'Montserrat', sans-serif;
}

.newsletter-message {
    margin-top: 15px;
    padding: 12px;
    border-radius: 4px;
    font-family: 'Montserrat', sans-serif;
    font-size: 14px;
    text-align: center;
    display: none;
}

.newsletter-message.success {
    background: rgba(40, 167, 69, 0.1);
    color: #28a745;
    border: 1px solid rgba(40, 167, 69, 0.2);
    display: block;
}

.newsletter-message.error {
    background: rgba(220, 53, 69, 0.1);
    color: #dc3545;
    border: 1px solid rgba(220, 53, 69, 0.2);
    display: block;
}

.subscribe-spinner {
    margin-left: 8px;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}



    /* ======================= RESPONSIVE STYLES ======================= */
    
    /* Mobile padding fix for slider */
    @media (max-width: 991px) {
        .frontpage-slider {
            padding-top: 60px;
        }
    }

    
  

    
    /* Mobile responsive for subscribe section */
    @media (max-width: 768px) {
        .subscribe {
            padding: 40px 15px;
        }
        
        .subscribe .title {
            font-size: 28px;
        }
        
        .subscribe .text p {
            font-size: 16px;
        }
        
        .subscribe .input-group {
            flex-direction: column;
            box-shadow: none;
        }
        
        .subscribe .form-control {
            border-radius: 4px !important;
            margin-bottom: 10px;
            height: 48px;
            text-align: center;
        }
        
        .subscribe .btn-main {
            width: 100%;
            height: 48px;
            border-radius: 4px !important;
        }

          .subscribe-form-group {
        flex-direction: column;
    }
    
    .subscribe-email {
        border-radius: 4px;
        margin-bottom: 10px;
        text-align: center;
    }
    
    .subscribe-btn {
        width: 100%;
        border-radius: 4px;
    }
    }

    /* ======================= FIX FOR INPUT-GROUP-APPEND ======================= */
    .subscribe .input-group-append {
        display: flex;
    }
    
    .subscribe .input-group-append .btn {
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
    }
    
    /* Fix for mobile where input-group-append might not work */
    @media (max-width: 768px) {
        .subscribe .input-group-append {
            width: 100%;
        }
    }
`;
export default css;
