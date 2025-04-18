import { useState, useEffect } from "react";
import { Flag } from "lucide-react";
import ReactDOM from 'react-dom'; // Import ReactDOM for portal

const ModalPortal = ({ children }) => {
  // Create a portal container if it doesn't exist
  const [portalContainer, setPortalContainer] = useState(null);
  
  useEffect(() => {
    // Check if a portal container already exists
    let container = document.getElementById('modal-portal-container');
    
    // If not, create one
    if (!container) {
      container = document.createElement('div');
      container.id = 'modal-portal-container';
      document.body.appendChild(container);
    }
    
    setPortalContainer(container);
    
    // Cleanup on unmount
    return () => {
      if (container && container.childNodes.length === 0) {
        document.body.removeChild(container);
      }
    };
  }, []);
  
  // Only render when we have a container
  if (!portalContainer) return null;
  
  // Use ReactDOM.createPortal to render children in the portal container
  return ReactDOM.createPortal(children, portalContainer);
};

const FlagIcon = ({ onClose, SongID }) => {
  const [selectedReason, setSelectedReason] = useState("");
  const [customReason, setCustomReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [currentUserId, setCurrentUserId] = useState("");
  const [isHoveringCancel, setIsHoveringCancel] = useState(false);
  const [isClickingCancel, setIsClickingCancel] = useState(false);
  const [isHoveringSubmit, setIsHoveringSubmit] = useState(false);
  const [isClickingSubmit, setIsClickingSubmit] = useState(false);
  const [reportErrorDialog, setReportErrorDialog] = useState("");
  
  const reportReasons = [
    "Select a reason",
    "Hate speech",
    "Violence or harmful content",
    "Misinformation",
    "Copyright violation",
    "Explicit content not properly labeled",
    "Spam or misleading",
    "Other (please specify)"
  ];

  const API_URL = "http://localhost:5142";

  // Lock body scroll when modal is open
  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  useEffect(() => {
    // Get token from localStorage
    const token = localStorage.getItem('userToken');
    if (token) {
      try {
        // gets token payload
        const payload = JSON.parse(atob(token.split('.')[1]));
  
        const userId = payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
        if (userId) {
          setCurrentUserId(userId);
        } 
        else {
          console.error("Could not find userID in token");
        }
      } catch (error) {
        console.error("Error parsing JWT token:", error);
      }
    } else {
      console.log("No token found in localStorage");
    }
  }, []);

  const handleReportSubmit = () => {
    // No reason selected
    if (selectedReason === "" || selectedReason === "Select a reason") {
      setError("Please select a reason for the report");
      return;
    }

    if (!currentUserId) {
      setError("No user ID available. Please log in again.");
      return;
    }
    
    if (!SongID) {
      setError("No song ID provided. Cannot submit report.");
      return;
    }
    
    // Determine the final reason to submit
    // If custom reason provided, include it with the selected reason
    const finalReason = customReason.trim() !== '' ? 
      `${selectedReason}: ${customReason}` : 
      selectedReason;
    
    setIsSubmitting(true);
    setError("");
    fetch(`${API_URL}/api/database/ReportSongs?SongID=${SongID}&UserID=${currentUserId}&Reason=${encodeURIComponent(finalReason)}`, {
      method: 'POST',
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
      return response.json();
    })
    .then(data => {
      console.log("Report submitted successfully:", data);
      setSuccess("Report submitted successfully");
      
      // Close the modal after a short delay
      setTimeout(() => {
        onClose();
      }, 1500);
    })
    .catch(error => {
      console.error("Error submitting report:", error);
      setError("Error submitting report: " + error.message);
    })
    .finally(() => {
      setIsSubmitting(false);
    });
  };

  // Use this to prevent event bubbling
  const handleStopPropagation = (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (e.nativeEvent) {
      e.nativeEvent.stopImmediatePropagation();
    }
  };

  // Overlay styles
  const overlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999999
  };

  // Modal content styles
  const modalStyle = {
    backgroundColor: '#1e1e1e',
    borderRadius: '10px',
    width: '90%',
    maxWidth: '500px',
    padding: '20px',
    maxHeight: '90vh',
    overflowY: 'auto',
    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.5)',
    
    color: 'white',
    zIndex: 10000000,
    position: 'relative'
  };

  // Header styles
  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    paddingBottom: '10px',
    borderBottom: '1px solid #343434'
  };

  // Form group styles
  const formGroupStyle = {
    marginBottom: '20px'
  };

  // Select styles
  const selectStyle = {
    width: '100%',
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #343434',
    backgroundColor: '#282828',
    color: 'white',
    fontFamily: "'Roboto Mono', monospace",
    fontSize: '14px'
  };

  // Textarea styles
  const textareaStyle = {
    width: '100%',
    minHeight: '100px',
    backgroundColor: '#282828',
    color: 'white',
    border: '1px solid #343434',
    borderRadius: '5px',
    padding: '10px',
    resize: 'none',
    fontFamily: "'Roboto Mono', monospace",
    fontSize: '14px'
  };

  // Button container styles
  const buttonContainerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '20px'
  };

  // Button base styles
  const buttonBaseStyle = {
    padding: '10px 20px',
    borderRadius: '50px',
    cursor: 'pointer',
    fontFamily: "'Roboto Mono', monospace",
    transition: 'all 0.2s ease'
  };

  // Cancel button styles with hover and active states
  const cancelButtonStyle = {
    ...buttonBaseStyle,
    backgroundColor: isClickingCancel ? 'rgba(255, 255, 255, 0.2)' : isHoveringCancel ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
    border: '1px solid white',
    color: 'white',
    transform: isClickingCancel ? 'scale(0.98)' : 'scale(1)',
    boxShadow: isHoveringCancel ? '0 2px 5px rgba(255, 255, 255, 0.2)' : 'none'
  };

  // Submit button styles with hover and active states
  const submitButtonStyle = {
    ...buttonBaseStyle,
    backgroundColor: isClickingSubmit ? '#7a1212' : isHoveringSubmit ? '#a01c1c' : '#8E1616',
    border: '1px solid #8E1616',
    color: 'white',
    transform: isClickingSubmit ? 'scale(0.98)' : 'scale(1)',
    boxShadow: isHoveringSubmit ? '0 2px 5px rgba(142, 22, 22, 0.5)' : 'none',
    opacity: isSubmitting ? 0.7 : 1
  };

  // Error message styles
  const errorMessageStyle = {
    color: '#ff5252',
    marginBottom: '15px',
    padding: '10px',
    backgroundColor: 'rgba(255, 82, 82, 0.1)',
    borderRadius: '4px'
  };

  // Success message styles
  const successMessageStyle = {
    color: '#4CAF50',
    marginBottom: '15px',
    padding: '10px',
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    borderRadius: '4px'
  };

  return (
    <ModalPortal>
      <div style={overlayStyle} onClick={onClose}>
        <div style={modalStyle} onClick={handleStopPropagation}>
          <div style={headerStyle}>
            <h2 style={{ margin: 0, fontSize: '1.5rem' }}>Report Song</h2>
            <button 
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                color: 'white',
                fontSize: '1.5rem',
                cursor: 'pointer'
              }}
            >
              ×
            </button>
          </div>

          <form onClick={handleStopPropagation}>
            <div style={formGroupStyle}>
              <label style={{ display: 'block', marginBottom: '8px' }}>
                Select a reason for reporting:
              </label>
              <select 
                value={selectedReason} 
                onChange={(e) => setSelectedReason(e.target.value)}
                style={selectStyle}
              >
                {reportReasons.map((reason, index) => (
                  <option key={index} value={reason}>{reason}</option>
                ))}
              </select>
            </div>
            
            <div style={formGroupStyle}>
              <label style={{ display: 'block', marginBottom: '8px' }}>
                Additional details (optional):
              </label>
              <textarea 
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                placeholder="Add any additional details about this report..."
                style={textareaStyle}
                rows={4}
              />
            </div>
            
            {error && <div style={errorMessageStyle}>{error}</div>}
            {success && <div style={successMessageStyle}>{success}</div>}
            
            <div style={buttonContainerStyle}>
              <button 
                type="button" 
                onClick={onClose}
                style={cancelButtonStyle}
                onMouseEnter={() => setIsHoveringCancel(true)}
                onMouseLeave={() => {
                  setIsHoveringCancel(false);
                  setIsClickingCancel(false);
                }}
                onMouseDown={() => setIsClickingCancel(true)}
                onMouseUp={() => setIsClickingCancel(false)}
              >
                CANCEL
              </button>
              <button 
                type="button" 
                onClick={handleReportSubmit}
                disabled={isSubmitting}
                style={submitButtonStyle}
                onMouseEnter={() => setIsHoveringSubmit(true)}
                onMouseLeave={() => {
                  setIsHoveringSubmit(false);
                  setIsClickingSubmit(false);
                }}
                onMouseDown={() => setIsClickingSubmit(true)}
                onMouseUp={() => setIsClickingSubmit(false)}
              >
                {isSubmitting ? "SUBMITTING..." : "REPORT SONG"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </ModalPortal>
  );
};

export default FlagIcon;