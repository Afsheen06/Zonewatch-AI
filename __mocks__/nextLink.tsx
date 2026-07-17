import React from "react";
const Link = ({
    children,
    href,
    style,
}: {
    children: React.ReactNode;
    href: string;
    style?: React.CSSProperties;
}) => (
    <a href={href} style={style}>
        {children}
    </a>
);
export default Link;
