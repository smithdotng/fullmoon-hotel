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
        .badge {
            font-size: 12px;
            padding: 5px 10px;
        }
        .badge-success {
            background-color: #28a745;
        }
        .badge-warning {
            background-color: #ffc107;
            color: #212529;
        }
        .text-success {
            color: #28a745 !important;
        }
        .alert {
            border-radius: 8px;
            border: none;
        }
        .alert-success {
            background-color: #e8f7ef;
            border-left: 4px solid #28a745;
        }
        .alert-info {
            background-color: #e8f4fd;
            border-left: 4px solid #17a2b8;
        }
        .alert-warning {
            background-color: #fff3cd;
            border-left: 4px solid #ffc107;
        }
`;
export default css;
