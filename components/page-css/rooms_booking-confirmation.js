// Page styles carried over from the original EJS view
const css = String.raw`
.white-block {
            background: #fff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            margin-bottom: 20px;
        }
        .cart-block-item .image img {
            width: 100px;
            height: 80px;
            object-fit: cover;
            border-radius: 4px;
        }
        .form-label {
            font-weight: 600;
            margin-bottom: 5px;
            display: block;
        }
        .btn-lg {
            padding: 12px 30px;
            font-size: 16px;
        }
        .list-unstyled li {
            padding: 5px 0;
        }
        .alert-info {
            background-color: #e8f4fd;
            border-left: 4px solid #17a2b8;
            border-radius: 8px;
            border: none;
        }
        .text-success {
            color: #28a745 !important;
        }
`;
export default css;
