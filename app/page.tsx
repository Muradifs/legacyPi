<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pi App Demo (Mock Enabled)</title>
    <!-- Tailwind CSS -->
    <script src="https://cdn.tailwindcss.com"></script>
    <!-- FontAwesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <!-- React & ReactDOM -->
    <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
    <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
    <!-- Babel -->
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
    
    <!-- Pi Network SDK (Official) -->
    <script src="https://sdk.minepi.com/pi-sdk.js"></script>

    <style>
        body {
            font-family: 'Inter', sans-serif;
            background-color: #F3F4F6;
        }
        .pi-purple { color: #612F74; }
        .bg-pi-purple { background-color: #612F74; }
        .pi-gold { color: #FBB44A; }
        .bg-pi-gold { background-color: #FBB44A; }
    </style>
</head>
<body>
    <div id="root"></div>

    <script type="text/babel">
        // --- 1. MOCK PI SDK IMPLEMENTATION ---
        // This runs if the official Pi SDK is not detected (e.g., in a normal browser)
        
        const setupPiMock = () => {
            if (window.Pi) {
                console.log("Official Pi SDK detected.");
                return;
            }

            console.warn("⚠️ Pi Browser not detected. Initializing Mock SDK for development.");
            
            window.Pi = {
                mock: true, // Flag to identify mock mode in UI
                init: ({ version, sandbox }) => {
                    console.log(`[Mock Pi] Initialized (v${version}, sandbox: ${sandbox})`);
                },
                authenticate: (scopes, onIncompletePaymentFound) => {
                    console.log(`[Mock Pi] Authenticating with scopes:`, scopes);
                    return new Promise((resolve) => {
                        setTimeout(() => {
                            resolve({
                                accessToken: "mock_access_token_" + Date.now(),
                                user: {
                                    uid: "mock_uid_" + Math.random().toString(36).substring(7),
                                    username: "TestUser_Alpha"
                                }
                            });
                        }, 1500); // Simulate network delay
                    });
                },
                createPayment: (paymentData, callbacks) => {
                    console.log(`[Mock Pi] Creating payment:`, paymentData);
                    
                    // Simulate the payment flow steps
                    setTimeout(() => {
                        console.log("[Mock Pi] onReadyForServerApproval");
                        if(callbacks.onReadyForServerApproval) callbacks.onReadyForServerApproval("mock_payment_id_123");
                    }, 1000);

                    setTimeout(() => {
                        console.log("[Mock Pi] onClientPresign");
                        if(callbacks.onClientPresign) callbacks.onClientPresign({ signature: "mock_sig", transactionId: "mock_tx_id" });
                    }, 2000);

                    setTimeout(() => {
                        console.log("[Mock Pi] onCompletion");
                        if(callbacks.onCompletion) callbacks.onCompletion({ result: "COMPLETED" });
                    }, 3500);
                },
                openShareDialog: (title, message) => {
                    alert(`[Mock Share] Title: ${title}\nMessage: ${message}`);
                }
            };
        };

        // Initialize the mock immediately
        setupPiMock();

        // --- 2. REACT APP COMPONENTS ---

        const { useState, useEffect } = React;

        const App = () => {
            const [user, setUser] = useState(null);
            const [loading, setLoading] = useState(true);
            const [error, setError] = useState(null);
            const [balance, setBalance] = useState(100.00); // Mock balance
            const [cart, setCart] = useState([]);
            const [processingPayment, setProcessingPayment] = useState(false);
            const [notification, setNotification] = useState(null);

            // Mock Product Data
            const products = [
                { id: 1, name: "Digital Art Pack", price: 3.14, icon: "fa-paintbrush" },
                { id: 2, name: "Premium Membership", price: 10.00, icon: "fa-crown" },
                { id: 3, name: "Cloud Storage (10GB)", price: 5.50, icon: "fa-cloud" },
                { id: 4, name: "Dev Support Coffee", price: 1.00, icon: "fa-mug-hot" },
            ];

            useEffect(() => {
                const initPi = async () => {
                    try {
                        const Pi = window.Pi;
                        Pi.init({ version: "2.0", sandbox: true });
                        
                        // Check if we need to authenticate
                        const scopes = ['username', 'payments'];
                        const authResult = await Pi.authenticate(scopes, onIncompletePaymentFound);
                        
                        setUser(authResult.user);
                        setLoading(false);
                    } catch (err) {
                        console.error("Pi Init Error:", err);
                        setError("Failed to initialize Pi SDK: " + err.message);
                        setLoading(false);
                    }
                };

                initPi();
            }, []);

            const onIncompletePaymentFound = (payment) => {
                console.log("Incomplete payment found:", payment);
                // Handle incomplete payments here
            };

            const handleBuy = (product) => {
                if (processingPayment) return;
                setProcessingPayment(true);
                setNotification({ type: 'info', message: `Initiating payment for ${product.name}...` });

                const paymentData = {
                    amount: product.price,
                    memo: `Purchase: ${product.name}`,
                    metadata: { productId: product.id }
                };

                const callbacks = {
                    onReadyForServerApproval: (paymentId) => {
                        console.log("Ready for approval", paymentId);
                        setNotification({ type: 'info', message: "Waiting for server approval..." });
                        // In a real app, you would send paymentId to your backend here
                    },
                    onClientPresign: (result) => {
                        console.log("Client presign", result);
                        setNotification({ type: 'info', message: "Signing transaction..." });
                        // In a real app, you would send signature to your backend here
                    },
                    onCompletion: (result) => {
                        console.log("Payment completed", result);
                        setNotification({ type: 'success', message: `Successfully purchased ${product.name}!` });
                        setBalance(prev => prev - product.price);
                        setProcessingPayment(false);
                        setTimeout(() => setNotification(null), 3000);
                    },
                    onCancel: () => {
                        setNotification({ type: 'error', message: "Payment cancelled by user." });
                        setProcessingPayment(false);
                        setTimeout(() => setNotification(null), 3000);
                    },
                    onError: (error) => {
                        console.error("Payment error", error);
                        setNotification({ type: 'error', message: "Payment failed: " + error.message });
                        setProcessingPayment(false);
                        setTimeout(() => setNotification(null), 3000);
                    }
                };

                try {
                    window.Pi.createPayment(paymentData, callbacks);
                } catch (err) {
                    setNotification({ type: 'error', message: "Error starting payment." });
                    setProcessingPayment(false);
                }
            };

            if (loading) {
                return (
                    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-800 mb-4"></div>
                        <p className="text-gray-600 font-medium">Connecting to Pi Network...</p>
                    </div>
                );
            }

            if (error) {
                return (
                    <div className="min-h-screen flex items-center justify-center bg-red-50 p-4">
                        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                            <div className="text-red-500 text-5xl mb-4 text-center"><i className="fa-solid fa-triangle-exclamation"></i></div>
                            <h2 className="text-xl font-bold text-center mb-2">Initialization Error</h2>
                            <p className="text-gray-600 text-center mb-4">{error}</p>
                            <button onClick={() => window.location.reload()} className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 transition">Retry</button>
                        </div>
                    </div>
                );
            }

            return (
                <div className="min-h-screen bg-gray-100 pb-20 relative">
                    {/* Top Status Bar */}
                    <div className="bg-pi-purple text-white p-4 shadow-md sticky top-0 z-10">
                        <div className="flex justify-between items-center max-w-4xl mx-auto">
                            <div className="flex items-center space-x-2">
                                <div className="bg-white text-purple-900 w-8 h-8 rounded-full flex items-center justify-center font-bold">
                                    <i className="fa-solid fa-pi"></i>
                                </div>
                                <span className="font-bold text-lg hidden sm:inline">PiMarket Demo</span>
                            </div>
                            
                            <div className="flex items-center space-x-4">
                                <div className="text-right">
                                    <p className="text-xs opacity-75">Welcome,</p>
                                    <p className="font-semibold leading-tight">{user ? user.username : 'Guest'}</p>
                                </div>
                                <div className="bg-purple-900 bg-opacity-50 px-3 py-1 rounded-full flex items-center space-x-2 border border-purple-700">
                                    <i className="fa-solid fa-wallet text-yellow-400"></i>
                                    <span className="font-mono">{balance.toFixed(2)} π</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Environment Badge */}
                    <div className={`text-center py-1 text-xs font-bold ${window.Pi.mock ? 'bg-yellow-100 text-yellow-800 border-b border-yellow-200' : 'bg-green-100 text-green-800 border-b border-green-200'}`}>
                        {window.Pi.mock ? 
                            <span><i className="fa-solid fa-tools mr-1"></i> Running in Mock Mode (Browser)</span> : 
                            <span><i className="fa-solid fa-check-circle mr-1"></i> Connected to Pi Browser</span>
                        }
                    </div>

                    {/* Notification Toast */}
                    {notification && (
                        <div className={`fixed top-24 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-lg shadow-xl z-50 flex items-center space-x-3 transition-all duration-300 ${
                            notification.type === 'error' ? 'bg-red-500 text-white' : 
                            notification.type === 'success' ? 'bg-green-500 text-white' : 
                            'bg-blue-600 text-white'
                        }`}>
                            <i className={`fa-solid ${
                                notification.type === 'error' ? 'fa-circle-xmark' : 
                                notification.type === 'success' ? 'fa-circle-check' : 
                                'fa-circle-info'
                            }`}></i>
                            <span>{notification.message}</span>
                        </div>
                    )}

                    {/* Main Content */}
                    <div className="max-w-4xl mx-auto p-4">
                        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">Marketplace</h2>
                            <p className="text-gray-500">Spend your test Pi on these digital goods. (Mock transactions only)</p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {products.map(product => (
                                <div key={product.id} className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-shadow">
                                    <div className="h-32 bg-gray-50 flex items-center justify-center text-gray-300 text-5xl">
                                        <i className={`fa-solid ${product.icon}`}></i>
                                    </div>
                                    <div className="p-5">
                                        <h3 className="font-bold text-lg text-gray-800 mb-1">{product.name}</h3>
                                        <div className="flex justify-between items-center mt-4">
                                            <span className="text-xl font-bold text-purple-700">{product.price.toFixed(2)} π</span>
                                            <button 
                                                onClick={() => handleBuy(product)}
                                                disabled={processingPayment}
                                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                                    processingPayment 
                                                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                                    : 'bg-pi-gold hover:bg-yellow-500 text-gray-900 shadow-sm'
                                                }`}
                                            >
                                                {processingPayment ? 'Processing...' : 'Buy Now'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Debug Info Footer */}
                    <div className="max-w-4xl mx-auto p-4 mt-8 border-t border-gray-200">
                        <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Developer Tools</h4>
                        <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-xs overflow-x-auto">
                            <p>// Current User Object:</p>
                            <p className="mb-2">{JSON.stringify(user, null, 2)}</p>
                            <p>// Environment:</p>
                            <p>{window.Pi.mock ? "BROWSER_MOCK" : "PI_BROWSER_WEBVIEW"}</p>
                        </div>
                    </div>
                </div>
            );
        };

        const root = ReactDOM.createRoot(document.getElementById('root'));
        root.render(<App />);
    </script>
</body>
</html>