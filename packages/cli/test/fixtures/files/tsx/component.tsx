/**
 * @file component.tsx
 */
import React from 'react';

interface MyFailingComponentProps {
  text: string;
}

const MyFailingComponent: React.FC<MyFailingComponentProps> = (props: MyFailingComponentProps) => {
    const {text} = props;

    return (
        <div>
            {text}
        </div>
    );
};

export default function MyComponent() {
    return (
        <div>
            <MyFailingComponent text="" />
        </div>
    );
}
