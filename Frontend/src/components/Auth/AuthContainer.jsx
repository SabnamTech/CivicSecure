import React, { useState } from 'react';
import Register from './Register';
import Login from './Login';

const AuthContainer = () => {
    const [isLogin, setIsLogin] = useState(false);

    return (
        <div>
            {isLogin ? (
                <Login onSwitchToRegister={() => setIsLogin(false)} />
            ) : (
                <Register onSwitchToLogin={() => setIsLogin(true)} />
            )}
        </div>
    );
};

export default AuthContainer;