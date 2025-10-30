import React, { useState, useRef, useEffect } from "react";
import {
  Menu,
  User,
  X,
  BookOpen,
  BarChart3,
  LayoutDashboard,
  CreditCard,
  ChevronDown,
  Trophy,
  History,
  Wallet,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

// Component Sidebar với dropdown và draggable button
const Sidebar = ({ isOpen, onToggle }) => {
  const location = useLocation();
  const [isCommercialOpen, setIsCommercialOpen] = useState(false);
  const [position, setPosition] = useState({ x: 15, y: 720 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [dropdownDirection, setDropdownDirection] = useState("down");
  const [dropdownAlign, setDropdownAlign] = useState("left");
  const buttonRef = useRef(null);
  const dropdownRef = useRef(null);

  // Xử lý bắt đầu kéo
  const handleMouseDown = (e) => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
      setIsDragging(true);
    }
  };

  // Kiểm tra vị trí và xác định hướng dropdown
  const checkDropdownDirection = () => {
    if (buttonRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const windowWidth = window.innerWidth;
      const dropdownHeight = 450;
      const dropdownWidth = 260;

      const spaceBelow = windowHeight - buttonRect.bottom;
      const spaceAbove = buttonRect.top;
      const spaceRight = windowWidth - buttonRect.right;
      const spaceLeft = buttonRect.left;

      if (spaceBelow < dropdownHeight && spaceAbove > spaceBelow) {
        setDropdownDirection("up");
      } else {
        setDropdownDirection("down");
      }

      if (spaceRight < dropdownWidth && spaceLeft > dropdownWidth) {
        setDropdownAlign("right");
      } else {
        setDropdownAlign("left");
      }
    }
  };

  // Xử lý di chuyển khi kéo
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isDragging) {
        setPosition({
          x: e.clientX - dragOffset.x,
          y: e.clientY - dragOffset.y,
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      checkDropdownDirection();
    };

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  // Kiểm tra hướng dropdown khi mở
  useEffect(() => {
    if (isOpen) {
      checkDropdownDirection();
    }
  }, [isOpen]);

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isOpen &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        onToggle();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onToggle]);

  const handleMenuClick = () => {
    if (!isDragging) {
      checkDropdownDirection();
      onToggle();
    }
  };

  return (
    <>
      {/* Draggable Button */}
      <button
        ref={buttonRef}
        onMouseDown={handleMouseDown}
        onClick={!isDragging ? handleMenuClick : undefined}
        style={{
          position: "fixed",
          left: `${position.x}px`,
          top: `${position.y}px`,
          zIndex: 1100,
          cursor: isDragging ? "grabbing" : "grab",
          background: isOpen
            ? "linear-gradient(135deg, #f97316 0%, #ea580c 100%)"
            : "linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)",
          border: "none",
          borderRadius: "50%",
          width: "40px",
          height: "40px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 4px 16px rgba(6, 182, 212, 0.4)",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          color: "white",
        }}
        onMouseEnter={(e) => {
          if (!isDragging) {
            e.currentTarget.style.transform = "scale(1.05) rotate(2deg)";
            e.currentTarget.style.boxShadow =
              "0 6px 20px rgba(249, 115, 22, 0.5)";
          }
        }}
        onMouseLeave={(e) => {
          if (!isDragging) {
            e.currentTarget.style.transform = "scale(1) rotate(0deg)";
            e.currentTarget.style.boxShadow =
              "0 4px 16px rgba(6, 182, 212, 0.4)";
          }
        }}
      >
        {isOpen ? <X size={18} /> : <Menu size={18} />}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          ref={dropdownRef}
          style={{
            position: "fixed",
            ...(dropdownAlign === "right"
              ? { right: `${window.innerWidth - position.x - 40}px` }
              : { left: `${position.x}px` }),
            ...(dropdownDirection === "up"
              ? { bottom: `${window.innerHeight - position.y}px` }
              : { top: `${position.y + 50}px` }),
            zIndex: 1099,
            minWidth: "260px",
            maxWidth: "280px",
            backgroundColor: "white",
            borderRadius: "16px",
            overflow: "hidden",
            boxShadow:
              "0 16px 48px rgba(6, 182, 212, 0.3), 0 8px 24px rgba(249, 115, 22, 0.2)",
            border: "2px solid rgba(6, 182, 212, 0.2)",
            animation:
              dropdownDirection === "up"
                ? "slideUp 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)"
                : "slideDown 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
          }}
        >
          {/* Header */}
          <div
            style={{
              background: "linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)",
              color: "white",
              padding: "18px",
            }}
          >
            <h3
              style={{
                fontWeight: "900",
                fontSize: "18px",
                margin: 0,
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <div
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                  backdropFilter: "blur(10px)",
                  padding: "8px",
                  borderRadius: "10px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <BookOpen size={20} />
              </div>
              Creator Menu
            </h3>
          </div>

          {/* Menu Items */}
          <nav style={{ padding: "8px 0" }}>
            <Link
              to="/creator/create_course"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "12px 16px",
                textDecoration: "none",
                transition: "all 0.3s ease",
                color:
                  location.pathname === "/creator/create_course"
                    ? "white"
                    : "#374151",
                background:
                  location.pathname === "/creator/create_course"
                    ? "linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)"
                    : "transparent",
                borderLeft:
                  location.pathname === "/creator/create_course"
                    ? "4px solid #f97316"
                    : "none",
                fontWeight:
                  location.pathname === "/creator/create_course"
                    ? "700"
                    : "600",
                boxShadow:
                  location.pathname === "/creator/create_course"
                    ? "0 4px 12px rgba(6, 182, 212, 0.3)"
                    : "none",
              }}
              onClick={onToggle}
              onMouseEnter={(e) => {
                if (location.pathname !== "/creator/create_course") {
                  e.currentTarget.style.background =
                    "linear-gradient(to right, rgba(6, 182, 212, 0.1), rgba(8, 145, 178, 0.1))";
                  e.currentTarget.style.color = "#06b6d4";
                }
              }}
              onMouseLeave={(e) => {
                if (location.pathname !== "/creator/create_course") {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "#374151";
                }
              }}
            >
              <div
                style={{
                  padding: "6px",
                  borderRadius: "8px",
                  backgroundColor:
                    location.pathname === "/creator/create_course"
                      ? "rgba(255, 255, 255, 0.2)"
                      : "#f3f4f6",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.3s ease",
                }}
              >
                <BookOpen size={18} />
              </div>
              <span>Create Your Course</span>
            </Link>

            <Link
              to="/creator/courseList"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "12px 16px",
                textDecoration: "none",
                transition: "all 0.3s ease",
                color:
                  location.pathname === "/creator/courseList"
                    ? "white"
                    : "#374151",
                background:
                  location.pathname === "/creator/courseList"
                    ? "linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)"
                    : "transparent",
                borderLeft:
                  location.pathname === "/creator/courseList"
                    ? "4px solid #f97316"
                    : "none",
                fontWeight:
                  location.pathname === "/creator/courseList" ? "700" : "600",
                boxShadow:
                  location.pathname === "/creator/courseList"
                    ? "0 4px 12px rgba(6, 182, 212, 0.3)"
                    : "none",
              }}
              onClick={onToggle}
              onMouseEnter={(e) => {
                if (location.pathname !== "/creator/courseList") {
                  e.currentTarget.style.background =
                    "linear-gradient(to right, rgba(6, 182, 212, 0.1), rgba(8, 145, 178, 0.1))";
                  e.currentTarget.style.color = "#06b6d4";
                }
              }}
              onMouseLeave={(e) => {
                if (location.pathname !== "/creator/courseList") {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "#374151";
                }
              }}
            >
              <div
                style={{
                  padding: "8px",
                  borderRadius: "10px",
                  backgroundColor:
                    location.pathname === "/creator/courseList"
                      ? "rgba(255, 255, 255, 0.2)"
                      : "#f3f4f6",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.3s ease",
                }}
              >
                <BarChart3 size={20} />
              </div>
              <span>Manager</span>
            </Link>

            <Link
              to="/creator/class/kahoot"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "12px 16px",
                textDecoration: "none",
                transition: "all 0.3s ease",
                color:
                  location.pathname === "/creator/class/kahoot"
                    ? "white"
                    : "#374151",
                background:
                  location.pathname === "/creator/class/kahoot"
                    ? "linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)"
                    : "transparent",
                borderLeft:
                  location.pathname === "/creator/class/kahoot"
                    ? "4px solid #f97316"
                    : "none",
                fontWeight:
                  location.pathname === "/creator/class/kahoot" ? "700" : "600",
                boxShadow:
                  location.pathname === "/creator/class/kahoot"
                    ? "0 4px 12px rgba(6, 182, 212, 0.3)"
                    : "none",
              }}
              onClick={onToggle}
              onMouseEnter={(e) => {
                if (location.pathname !== "/creator/class/kahoot") {
                  e.currentTarget.style.background =
                    "linear-gradient(to right, rgba(6, 182, 212, 0.1), rgba(8, 145, 178, 0.1))";
                  e.currentTarget.style.color = "#06b6d4";
                }
              }}
              onMouseLeave={(e) => {
                if (location.pathname !== "/creator/class/kahoot") {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "#374151";
                }
              }}
            >
              <div
                style={{
                  padding: "6px",
                  borderRadius: "8px",
                  backgroundColor:
                    location.pathname === "/creator/class/kahoot"
                      ? "rgba(255, 255, 255, 0.2)"
                      : "#f3f4f6",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.3s ease",
                }}
              >
                <Trophy size={18} />
              </div>
              <span>Kahoot</span>
            </Link>

            <Link
              to="/creator/profile"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "12px 16px",
                textDecoration: "none",
                transition: "all 0.3s ease",
                color:
                  location.pathname === "/creator/profile"
                    ? "white"
                    : "#374151",
                background:
                  location.pathname === "/creator/profile"
                    ? "linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)"
                    : "transparent",
                borderLeft:
                  location.pathname === "/creator/profile"
                    ? "4px solid #f97316"
                    : "none",
                fontWeight:
                  location.pathname === "/creator/profile" ? "700" : "600",
                boxShadow:
                  location.pathname === "/creator/profile"
                    ? "0 4px 12px rgba(6, 182, 212, 0.3)"
                    : "none",
              }}
              onClick={onToggle}
              onMouseEnter={(e) => {
                if (location.pathname !== "/creator/profile") {
                  e.currentTarget.style.background =
                    "linear-gradient(to right, rgba(6, 182, 212, 0.1), rgba(8, 145, 178, 0.1))";
                  e.currentTarget.style.color = "#06b6d4";
                }
              }}
              onMouseLeave={(e) => {
                if (location.pathname !== "/creator/profile") {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "#374151";
                }
              }}
            >
              <div
                style={{
                  padding: "6px",
                  borderRadius: "8px",
                  backgroundColor:
                    location.pathname === "/creator/profile"
                      ? "rgba(255, 255, 255, 0.2)"
                      : "#f3f4f6",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.3s ease",
                }}
              >
                <User size={18} />
              </div>
              <span>Creator Account</span>
            </Link>

            {/* Commercial Dropdown */}
            <div
              style={{
                borderTop: "1px solid rgba(6, 182, 212, 0.15)",
                marginTop: "8px",
                paddingTop: "8px",
              }}
            >
              <button
                onClick={() => setIsCommercialOpen(!isCommercialOpen)}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "10px",
                  padding: "12px 16px",
                  border: "none",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  color: location.pathname.startsWith("/creator/commercial")
                    ? "white"
                    : "#374151",
                  background: location.pathname.startsWith(
                    "/creator/commercial"
                  )
                    ? "linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)"
                    : "transparent",
                  borderRadius: "12px",
                  fontWeight: location.pathname.startsWith(
                    "/creator/commercial"
                  )
                    ? "700"
                    : "600",
                  boxShadow: location.pathname.startsWith("/creator/commercial")
                    ? "0 4px 12px rgba(6, 182, 212, 0.3)"
                    : "none",
                }}
                onMouseEnter={(e) => {
                  if (!location.pathname.startsWith("/creator/commercial")) {
                    e.currentTarget.style.background =
                      "linear-gradient(to right, rgba(6, 182, 212, 0.1), rgba(8, 145, 178, 0.1))";
                    e.currentTarget.style.color = "#06b6d4";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!location.pathname.startsWith("/creator/commercial")) {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = "#374151";
                  }
                }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: "10px" }}
                >
                  <div
                    style={{
                      padding: "6px",
                      borderRadius: "8px",
                      backgroundColor: location.pathname.startsWith(
                        "/creator/commercial"
                      )
                        ? "rgba(255, 255, 255, 0.2)"
                        : "#f3f4f6",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "all 0.3s ease",
                    }}
                  >
                    <BarChart3 size={18} />
                  </div>
                  <span>Commercial</span>
                </div>
                <ChevronDown
                  size={18}
                  style={{
                    transition: "transform 0.3s ease",
                    transform: isCommercialOpen
                      ? "rotate(180deg)"
                      : "rotate(0deg)",
                  }}
                />
              </button>

              {/* Submenu */}
              {isCommercialOpen && (
                <div
                  style={{
                    background:
                      "linear-gradient(to bottom right, rgba(6, 182, 212, 0.05), rgba(8, 145, 178, 0.05))",
                    padding: "8px",
                    marginTop: "6px",
                    borderRadius: "10px",
                    marginLeft: "6px",
                    marginRight: "6px",
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "6px",
                  }}
                >
                  <Link
                    to="/creator/commercial/dashboard"
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "4px",
                      padding: "8px 6px",
                      margin: "0",
                      borderRadius: "8px",
                      textDecoration: "none",
                      transition: "all 0.3s ease",
                      color:
                        location.pathname === "/creator/commercial/dashboard"
                          ? "white"
                          : "#374151",
                      background:
                        location.pathname === "/creator/commercial/dashboard"
                          ? "linear-gradient(135deg, #f97316 0%, #ea580c 100%)"
                          : "transparent",
                      fontWeight:
                        location.pathname === "/creator/commercial/dashboard"
                          ? "700"
                          : "600",
                      boxShadow:
                        location.pathname === "/creator/commercial/dashboard"
                          ? "0 4px 12px rgba(249, 115, 22, 0.4)"
                          : "none",
                    }}
                    onClick={onToggle}
                    onMouseEnter={(e) => {
                      if (
                        location.pathname !== "/creator/commercial/dashboard"
                      ) {
                        e.currentTarget.style.background = "white";
                        e.currentTarget.style.boxShadow =
                          "0 2px 8px rgba(0, 0, 0, 0.1)";
                        e.currentTarget.style.color = "#06b6d4";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (
                        location.pathname !== "/creator/commercial/dashboard"
                      ) {
                        e.currentTarget.style.background = "transparent";
                        e.currentTarget.style.boxShadow = "none";
                        e.currentTarget.style.color = "#374151";
                      }
                    }}
                  >
                    <div
                      style={{
                        padding: "6px",
                        borderRadius: "8px",
                        backgroundColor:
                          location.pathname === "/creator/commercial/dashboard"
                            ? "rgba(255, 255, 255, 0.2)"
                            : "rgba(6, 182, 212, 0.1)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <LayoutDashboard size={16} />
                    </div>
                    <span style={{ fontSize: "11px", textAlign: "center" }}>
                      Dashboard
                    </span>
                  </Link>

                  <Link
                    to="/creator/commercial/courseDetail"
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "4px",
                      padding: "8px 6px",
                      margin: "0",
                      borderRadius: "8px",
                      textDecoration: "none",
                      transition: "all 0.3s ease",
                      color:
                        location.pathname === "/creator/commercial/courseDetail"
                          ? "white"
                          : "#374151",
                      background:
                        location.pathname === "/creator/commercial/courseDetail"
                          ? "linear-gradient(135deg, #f97316 0%, #ea580c 100%)"
                          : "transparent",
                      fontWeight:
                        location.pathname === "/creator/commercial/courseDetail"
                          ? "700"
                          : "600",
                      boxShadow:
                        location.pathname === "/creator/commercial/courseDetail"
                          ? "0 4px 12px rgba(249, 115, 22, 0.4)"
                          : "none",
                    }}
                    onClick={onToggle}
                    onMouseEnter={(e) => {
                      if (
                        location.pathname !== "/creator/commercial/courseDetail"
                      ) {
                        e.currentTarget.style.background = "white";
                        e.currentTarget.style.boxShadow =
                          "0 2px 8px rgba(0, 0, 0, 0.1)";
                        e.currentTarget.style.color = "#06b6d4";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (
                        location.pathname !== "/creator/commercial/courseDetail"
                      ) {
                        e.currentTarget.style.background = "transparent";
                        e.currentTarget.style.boxShadow = "none";
                        e.currentTarget.style.color = "#374151";
                      }
                    }}
                  >
                    <div
                      style={{
                        padding: "6px",
                        borderRadius: "8px",
                        backgroundColor:
                          location.pathname ===
                          "/creator/commercial/courseDetail"
                            ? "rgba(255, 255, 255, 0.2)"
                            : "rgba(6, 182, 212, 0.1)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <CreditCard size={16} />
                    </div>
                    <span style={{ fontSize: "11px", textAlign: "center" }}>
                      Course Detail
                    </span>
                  </Link>

                  <Link
                    to="/creator/commercial/history_transaction"
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "4px",
                      padding: "8px 6px",
                      margin: "0",
                      borderRadius: "8px",
                      textDecoration: "none",
                      transition: "all 0.3s ease",
                      color:
                        location.pathname ===
                        "/creator/commercial/history_transaction"
                          ? "white"
                          : "#374151",
                      background:
                        location.pathname ===
                        "/creator/commercial/history_transaction"
                          ? "linear-gradient(135deg, #f97316 0%, #ea580c 100%)"
                          : "transparent",
                      fontWeight:
                        location.pathname ===
                        "/creator/commercial/history_transaction"
                          ? "700"
                          : "600",
                      boxShadow:
                        location.pathname ===
                        "/creator/commercial/history_transaction"
                          ? "0 4px 12px rgba(249, 115, 22, 0.4)"
                          : "none",
                    }}
                    onClick={onToggle}
                    onMouseEnter={(e) => {
                      if (
                        location.pathname !==
                        "/creator/commercial/history_transaction"
                      ) {
                        e.currentTarget.style.background = "white";
                        e.currentTarget.style.boxShadow =
                          "0 2px 8px rgba(0, 0, 0, 0.1)";
                        e.currentTarget.style.color = "#06b6d4";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (
                        location.pathname !==
                        "/creator/commercial/history_transaction"
                      ) {
                        e.currentTarget.style.background = "transparent";
                        e.currentTarget.style.boxShadow = "none";
                        e.currentTarget.style.color = "#374151";
                      }
                    }}
                  >
                    <div
                      style={{
                        padding: "6px",
                        borderRadius: "8px",
                        backgroundColor:
                          location.pathname ===
                          "/creator/commercial/history_transaction"
                            ? "rgba(255, 255, 255, 0.2)"
                            : "rgba(6, 182, 212, 0.1)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <History size={16} />
                    </div>
                    <span
                      style={{
                        fontSize: "11px",
                        textAlign: "center",
                      }}
                    >
                      Transaction History
                    </span>
                  </Link>

                  <Link
                    to="/creator/commercial/balance"
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "4px",
                      padding: "8px 6px",
                      margin: "0",
                      borderRadius: "8px",
                      textDecoration: "none",
                      transition: "all 0.3s ease",
                      color:
                        location.pathname === "/creator/commercial/balance"
                          ? "white"
                          : "#374151",
                      background:
                        location.pathname === "/creator/commercial/balance"
                          ? "linear-gradient(135deg, #f97316 0%, #ea580c 100%)"
                          : "transparent",
                      fontWeight:
                        location.pathname === "/creator/commercial/balance"
                          ? "700"
                          : "600",
                      boxShadow:
                        location.pathname === "/creator/commercial/balance"
                          ? "0 4px 12px rgba(249, 115, 22, 0.4)"
                          : "none",
                    }}
                    onClick={onToggle}
                    onMouseEnter={(e) => {
                      if (location.pathname !== "/creator/commercial/balance") {
                        e.currentTarget.style.background = "white";
                        e.currentTarget.style.boxShadow =
                          "0 2px 8px rgba(0, 0, 0, 0.1)";
                        e.currentTarget.style.color = "#06b6d4";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (location.pathname !== "/creator/commercial/balance") {
                        e.currentTarget.style.background = "transparent";
                        e.currentTarget.style.boxShadow = "none";
                        e.currentTarget.style.color = "#374151";
                      }
                    }}
                  >
                    <div
                      style={{
                        padding: "6px",
                        borderRadius: "8px",
                        backgroundColor:
                          location.pathname === "/creator/commercial/balance"
                            ? "rgba(255, 255, 255, 0.2)"
                            : "rgba(6, 182, 212, 0.1)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Wallet size={16} />
                    </div>
                    <span
                      style={{
                        fontSize: "11px",
                        textAlign: "center",
                      }}
                    >
                      Your Budget
                    </span>
                  </Link>
                </div>
              )}
            </div>
          </nav>

          {/* Footer */}
          <div
            style={{
              background: "linear-gradient(to right, #f8fafc, #e0f2fe)",
              padding: "14px",
              borderTop: "2px solid rgba(6, 182, 212, 0.2)",
            }}
          >
            <p
              style={{
                fontSize: "11px",
                color: "#64748b",
                textAlign: "center",
                fontWeight: "600",
                margin: "0 0 6px 0",
              }}
            >
              © 2024 JPD Learning Platform
            </p>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "8px",
              }}
            >
              <div
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  background: "#06b6d4",
                }}
              ></div>
              <div
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  background: "#f97316",
                }}
              ></div>
              <div
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  background: "#06b6d4",
                }}
              ></div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </>
  );
};

export default Sidebar;
