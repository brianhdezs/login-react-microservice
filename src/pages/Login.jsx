import React from 'react';
import Layout from '../components/Layout/Layout';
import LoginForm from '../components/Auth/LoginForm';
import ProtectedRoute from '../components/Auth/ProtectedRoute';

const Login = () => {
  return (
    <ProtectedRoute requireAuth={false}>
      <Layout>
        <LoginForm />
      </Layout>
    </ProtectedRoute>
  );
};

export default Login;