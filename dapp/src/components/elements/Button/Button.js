// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

const Button = ({onClick, className, children, disabled, type = 'button'}) => {
  return (
    <button
      type={type}
      className={`w-full bg-blue-500 hover:bg-blue-700 disabled:bg-blue-900 text-white font-bold py-2 px-4 rounded ${className}`}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
