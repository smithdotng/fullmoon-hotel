// Page styles carried over from the original EJS view
const css = String.raw`
/* Service Card Styles (Consistent with Laundry Page) */
        .service-card {
            background: white;
            border-radius: 8px;
            padding: 30px;
            margin-bottom: 30px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
            transition: transform 0.3s ease;
            height: 100%;
        }
        .service-card:hover {
            transform: translateY(-5px);
        }
        .service-icon {
            font-size: 48px;
            color: #c19b76;
            margin-bottom: 20px;
        }

        /* Process/Highlight Steps Styles */
        .process-step {
            text-align: center;
            padding: 20px;
        }
        .step-number {
            width: 50px;
            height: 50px;
            background: #c19b76;
            color: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 15px;
            font-size: 20px;
            font-weight: bold;
        }

        /* List Items */
        .benefit-item {
            display: flex;
            align-items: center;
            margin-bottom: 15px;
        }
        .benefit-icon {
            color: #c19b76;
            margin-right: 15px;
            font-size: 20px;
        }

        /* Alert styling for flash messages (assuming Bootstrap theme is in use) */
        .alert-message {
            padding: 15px;
            margin-bottom: 20px;
            border: 1px solid transparent;
            border-radius: 4px;
        }
        .alert-success {
            color: #3c763d;
            background-color: #dff0d8;
            border-color: #d6e9c6;
        }
        .alert-danger {
            color: #a94442;
            background-color: #f2dede;
            border-color: #ebccd1;
        }
`;
export default css;
