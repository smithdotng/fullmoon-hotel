// Page styles carried over from the original EJS view
const css = String.raw`
.login-container {
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 70vh;
            padding: 2rem 0;
            position: relative;
        }
        
        .login-wrapper {
            width: 100%;
            max-width: 450px;
            margin: 0 auto;
        }
        
        .login-card {
            background: #ffffff;
            border-radius: 20px;
            box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
            border: none;
            overflow: hidden;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .login-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
        }
        
        .card-header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 2.5rem 2rem;
            border: none;
            text-align: center;
        }
        
        .lock-icon {
            font-size: 3rem;
            margin-bottom: 1rem;
            display: block;
            opacity: 0.9;
        }
        
        .login-title {
            font-size: 1.8rem;
            font-weight: 700;
            margin-bottom: 0.5rem;
            color: white;
        }
        
        .login-subtitle {
            font-size: 1rem;
            opacity: 0.9;
            margin-bottom: 0;
            color: rgba(255, 255, 255, 0.9);
        }
        
        .card-body {
            padding: 2.5rem;
        }
        
        .login-form {
            margin-bottom: 1.5rem;
        }
        
        .form-group {
            margin-bottom: 1.5rem;
        }
        
        .form-label {
            font-weight: 600;
            color: #333;
            margin-bottom: 0.5rem;
            display: block;
        }
        
        .input-group-text {
            background-color: #f8f9fa;
            border: 1px solid #e9ecef;
            border-right: none;
            padding: 0.75rem 1rem;
        }
        
        .form-control {
            border: 1px solid #e9ecef;
            border-left: none;
            padding: 0.75rem;
            height: auto;
            transition: all 0.3s ease;
        }
        
        .form-control:focus {
            border-color: #667eea;
            box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.15);
        }
        
        .input-group:focus-within .input-group-text {
            border-color: #667eea;
            background-color: #fff;
        }
        
        .btn-login {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border: none;
            border-radius: 10px;
            padding: 1rem 2rem;
            font-weight: 600;
            font-size: 1.1rem;
            color: white;
            width: 100%;
            transition: all 0.3s ease;
            margin-top: 0.5rem;
        }
        
        .btn-login:hover {
            background: linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%);
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
        }
        
        .test-credentials {
            margin: 2rem 0 1.5rem 0;
        }
        
        .credentials-card {
            background: #f8f9fa;
            border-radius: 12px;
            padding: 1.5rem;
            border-left: 4px solid #667eea;
        }
        
        .info-icon {
            color: #667eea;
            font-size: 1.5rem;
            margin-bottom: 0.5rem;
            display: block;
        }
        
        .credentials-card h6 {
            color: #333;
            margin-bottom: 1rem;
            font-weight: 600;
        }
        
        .credentials {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
        }
        
        .credentials span {
            font-size: 0.9rem;
            color: #666;
        }
        
        .back-home {
            margin-top: 1.5rem;
        }
        
        .back-link {
            color: #667eea;
            text-decoration: none;
            font-weight: 500;
            transition: color 0.3s ease;
        }
        
        .back-link:hover {
            color: #764ba2;
        }
        
        .alert {
            border-radius: 12px;
            border: none;
            margin-bottom: 1.5rem;
        }
        
        /* Responsive Design */
        @media (max-width: 768px) {
            .login-container {
                min-height: 60vh;
                padding: 1rem;
            }
            
            .login-wrapper {
                max-width: 400px;
            }
            
            .card-body {
                padding: 2rem;
            }
            
            .card-header {
                padding: 2rem 1.5rem;
            }
        }
        
        @media (max-width: 576px) {
            .login-wrapper {
                max-width: 100%;
            }
            
            .card-body {
                padding: 1.5rem;
            }
            
            .card-header {
                padding: 1.5rem 1rem;
            }
            
            .login-title {
                font-size: 1.5rem;
            }
        }
`;
export default css;
