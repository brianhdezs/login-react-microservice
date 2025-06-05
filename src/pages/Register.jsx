import React from 'react';
import Layout from '../components/Layout/Layout';
import RegisterForm from '../components/Auth/RegisterForm';
import ProtectedRoute from '../components/Auth/ProtectedRoute';

const Register = () => {
  return (
    <ProtectedRoute requireAuth={false}>
      <Layout>
        <RegisterForm />
      </Layout>
    </ProtectedRoute>
  );
};

export default Register;