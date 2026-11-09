// Page styles carried over from the original EJS view
const css = String.raw`
.map-placeholder {
        background: #f8f9fa;
        padding: 80px 20px;
        border-radius: 8px;
        margin-bottom: 40px;
        border: 2px dashed #dee2e6;
    }
    .contact-form-wrapper {
        margin: 40px 0;
    }
    .open-form {
        margin-bottom: 30px;
        cursor: pointer;
    }
    .contact-form {
        display: none; /* Start hidden */
        margin-top: 30px;
        padding: 30px;
        background: #ADD8E6;
        border-radius: 8px;
        border: 1px solid #e9ecef;
    }
    .contact-form.active {
        display: block;
    }
    .alert {
        margin: 20px 0;
    }
    .contact-info figure {
        padding: 20px;
        margin: 10px 0;
        transition: transform 0.3s ease;
    }
    .contact-info figure:hover {
        transform: translateY(-5px);
    }
    .contact-info .icon {
        font-size: 36px;
        color: #c19b76;
        margin-bottom: 15px;
    }
    .form-control.error {
        border-color: #dc3545;
        box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25);
    }
    .has-error .form-control {
        border-color: #dc3545;
    }
    .form-error-message {
        animation: shake 0.5s ease-in-out;
    }
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }
`;
export default css;
