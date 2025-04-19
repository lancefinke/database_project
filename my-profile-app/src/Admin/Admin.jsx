import React, { useState, useEffect } from 'react';
import { useRef } from 'react';

import { Play, Pause, ArrowUp, ArrowDown, Filter, ChevronDown } from "lucide-react";
import UserLink from "../UserLink/UserLink";
import "./Admin.css"; // Using your existing Admin.css
import ReactHowler from 'react-howler';

const AdminPage = () => {
    const [adminData, setAdminData] = useState({
        artists: [],
        listeners: [],
        bannedUsers: [],
        bannedSongs: [],
        reportedSongs: [],
        loading: true,
        error: null
    });

    // Sort states
    const [sortConfig, setSortConfig] = useState({
        artists: { key: 'Username', direction: 'ascending' },
        listeners: { key: 'Username', direction: 'ascending' },
        bannedUsers: { key: 'Username', direction: 'ascending' }
    });

    // Filter states
    const [filterConfig, setFilterConfig] = useState({
        artists: '',
        listeners: '',
        bannedUsers: '',
        bannedSongs: '',
        reportedSongs: ''
    });

    // Time period filter
    const [timePeriodFilter, setTimePeriodFilter] = useState({
        artists: 'all',
        listeners: 'all',
        bannedUsers: 'all'
    });

    // Active tab for song reports
    const [activeTab, setActiveTab] = useState('statistics');
    const [hasFetchedReportedSongs, setHasFetchedReportedSongs] = useState(false);

    // Add a new state to track the selected artist for strike details
    const [selectedArtist, setSelectedArtist] = useState(null);
    
    // Play song inside reported songs
    const [playingSongId, setPlayingSongId] = useState(null);
    // to see strike details of songs for artist
    const [strikeDetails, setStrikeDetails] = useState([]);

    const togglePlay = (songId) => {
    setPlayingSongId((prevId) => (prevId === songId ? null : songId));
    };
    const audioRefs = useRef({}); // Store audio refs for each ReportID

    const handleTogglePlay = (song) => {
    const id = song.ReportID;

    if (!audioRefs.current[id]) {
        audioRefs.current[id] = new Audio(song.SongFileName);
    }

    const currentAudio = audioRefs.current[id];

    if (playingSongId === id) {
        currentAudio.pause();
        setPlayingSongId(null);
    } else {
        // Pause any currently playing audio
        Object.keys(audioRefs.current).forEach((key) => {
        if (parseInt(key) !== id) {
            audioRefs.current[key].pause();
            audioRefs.current[key].currentTime = 0;
        }
        });

        currentAudio.play();
        setPlayingSongId(id);
    }
    };


    // Your existing API URL
    const API_URL = "https://localhost:7152/";
    const fetchAdminData = async (setAdminData, API_URL) => {
        try {
            const userReportResponse = await fetch(API_URL + "api/Users/GenerateUserReport", {
                method: "GET",
                headers: {
                    'Accept': 'application/json'
                },
                mode: 'cors'
            });
    
            if (!userReportResponse.ok) {
                throw new Error('User report API failed');
            }
    
            const userReportResult = await userReportResponse.json();
            console.log("Fetched user report:", userReportResult);
    
            setAdminData(prev => ({
                ...prev,
                artists: userReportResult.Artists || [],
                listeners: userReportResult.Listeners || [],
                bannedUsers: userReportResult.BannedUsers || [],
                loading: false,
                error: null
            }));
        } catch (error) {
            console.error("Error fetching user report:", error);
            setAdminData(prev => ({
                ...prev,
                loading: false,
                error: error.message
            }));
        }
    };
    
    // Inside your component
    useEffect(() => {
        fetchAdminData(setAdminData, API_URL);
    }, []);
    
    useEffect(() => {
        const fetchReportedAndBannedSongs = async () => {
            try {
                const [reportedRes, bannedRes] = await Promise.all([
                fetch(`${API_URL}api/database/GetReportedSongs`, {
                    method: "GET",
                    headers: { Accept: "application/json" },
                    mode: "cors"
                }),
                fetch(`${API_URL}api/database/GetBannedSongs`, {
                    method: "GET",
                    headers: { Accept: "application/json" },
                    mode: "cors"
                })
                ]);
        
                if (!reportedRes.ok || !bannedRes.ok) {
                throw new Error("Failed to fetch reported or banned songs");
                }
        
                const [reportedSongs, bannedSongs] = await Promise.all([
                reportedRes.json(),
                bannedRes.json()
                ]);
        
                setAdminData(prev => ({
                ...prev,
                reportedSongs,
                bannedSongs
                }));
        
                setHasFetchedReportedSongs(true);
            } catch (err) {
                console.error("Error fetching reported/banned songs:", err);
            }
            };
        
            fetchReportedAndBannedSongs();
        }, []);
        
    

    // Add this function to handle clicking on an artist
    const handleArtistClick = async (artist) => {
        console.log("Clicked artist:", artist);
    
        if (selectedArtist && selectedArtist.Username === artist.Username) {
            setSelectedArtist(null);
            setStrikeDetails([]);
        } else {
            setSelectedArtist(artist);
    
            try {
                const res = await fetch(`${API_URL}api/database/GetStrikeDetailsByArtist?artistId=${artist.ArtistID}`, {
                    method: "GET",
                    headers: {
                        'Accept': 'application/json'
                    },
                    mode: 'cors'
                });
    
                if (!res.ok) throw new Error("Failed to fetch strike details");
    
                const data = await res.json();
                console.log("Fetched strike details:", data);
                setStrikeDetails(data);
            } catch (error) {
                console.error("Error fetching strike details:", error);
            }
        }
    };
    

    // Calculate statistics from the data
    const calculateStats = () => {
        if (adminData.loading) return [
            { name: 'Total Users', stat: 0 },
            { name: 'Artist Users', stat: 0 },
            { name: 'Listener Users', stat: 0 },
            { name: 'Banned Users', stat: 0 },
            { name: 'Banned Songs', stat: 0 },
            { name: 'Reported Songs', stat: 0 },
            { name: 'Artists with Strikes', stat: 0 }
        ];

        // Count artists with strikes
        const artistsWithStrikes = adminData.artists.filter(artist => 
            artist.StrikeCount && artist.StrikeCount > 0
        ).length;

        return [
            { name: 'Total Users', stat: adminData.artists.length + adminData.listeners.length + adminData.bannedUsers.length },
            { name: 'Artist Users', stat: adminData.artists.length },
            { name: 'Listener Users', stat: adminData.listeners.length },
            { name: 'Banned Users', stat: adminData.bannedUsers.length },
            { name: 'Banned Songs', stat: adminData.bannedSongs.length },
            { name: 'Reported Songs', stat: adminData.reportedSongs.length },
            { name: 'Artists with Strikes', stat: artistsWithStrikes }
        ];
    };

    // Sorting function
    const requestSort = (category, key) => {
        let direction = 'ascending';
        if (sortConfig[category] && sortConfig[category].key === key && sortConfig[category].direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig(prev => ({
            ...prev,
            [category]: { key, direction }
        }));
    };

    // Get sorted data
    const getSortedData = (data, category) => {
        if (!sortConfig[category]) return data;
        
        return [...data].sort((a, b) => {
            if (a[sortConfig[category].key] < b[sortConfig[category].key]) {
                return sortConfig[category].direction === 'ascending' ? -1 : 1;
            }
            if (a[sortConfig[category].key] > b[sortConfig[category].key]) {
                return sortConfig[category].direction === 'ascending' ? 1 : -1;
            }
            return 0;
        });
    };

    // Handle filter change
    const handleFilterChange = (category, value) => {
        setFilterConfig(prev => ({
            ...prev,
            [category]: value
        }));
    };

    // Handle time period change
    const handleTimePeriodChange = (category, value) => {
        setTimePeriodFilter(prev => ({
            ...prev,
            [category]: value
        }));
    };

    // Filter data by time period
    const filterByTimePeriod = (data, category) => {
        if (timePeriodFilter[category] === 'all') return data;
        
        const now = new Date();
        let cutoffDate = new Date();
        
        switch (timePeriodFilter[category]) {
            case 'week':
                cutoffDate.setDate(now.getDate() - 7);
                break;
            case 'month':
                cutoffDate.setMonth(now.getMonth() - 1);
                break;
            case 'year':
                cutoffDate.setFullYear(now.getFullYear() - 1);
                break;
            default:
                return data;
        }
        
        return data.filter(item => {
            const dateField = category === 'bannedUsers' ? 'BannedAt' : 'CreatedAt';
            const itemDate = new Date(item[dateField]);
            return itemDate >= cutoffDate;
        });
    };

    // Get filtered data
    const getFilteredData = (data, category) => {
        if (!filterConfig[category]) {
            return filterByTimePeriod(data, category);
        }
        
        const filteredBySearch = data.filter(item => {
            // Check different fields depending on the category
            if (category === 'artists' || category === 'listeners' || category === 'bannedUsers') {
                return (
                    item.Username.toLowerCase().includes(filterConfig[category].toLowerCase()) ||
                    item.Email.toLowerCase().includes(filterConfig[category].toLowerCase())
                );
            } else if (category === 'bannedSongs' || category === 'reportedSongs') {
                return (
                    item.title.toLowerCase().includes(filterConfig[category].toLowerCase()) ||
                    item.artist.toLowerCase().includes(filterConfig[category].toLowerCase()) ||
                    item.reason.toLowerCase().includes(filterConfig[category].toLowerCase())
                );
            }
            return true;
        });
        
        return filterByTimePeriod(filteredBySearch, category);
    };

    // Handle song action (approve/ban for reported songs)
    const handleSongAction = async (reportId, action) => {
        const newStatus = action === 'approve' ? 2 : 3;
    
        try {
            const response = await fetch(`${API_URL}api/database/UpdateReportStatus`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    reportID: reportId,
                    status: newStatus
                })
            });
    
            if (!response.ok) throw new Error("Failed to update report status.");
    
            // Refresh reported songs after update
            const reportedRes = await fetch(`${API_URL}api/database/GetReportedSongs`);
            const updatedReportedSongs = await reportedRes.json();
    
            setAdminData(prev => ({
                ...prev,
                reportedSongs: updatedReportedSongs
            }));
    
            console.log("Reported songs updated.");
        } catch (error) {
            console.error("Error updating report status:", error);
        }
    };
    
    
    // Handle user action
    const handleUserAction = async (username, action) => {
        console.log(`${action} user: ${username}`);
    
        let user = adminData.artists.find(u => u.Username === username);
        let isArtist = true;
    
        if (!user) {
            user = adminData.listeners.find(u => u.Username === username);
            isArtist = false;
        }
    
        if (!user) {
            console.error("User not found.");
            return;
        }
    
        try {
            const response = await fetch(`${API_URL}api/Users/BanUser`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ArtistID: isArtist ? user.ArtistID : null,
                    UserID: isArtist ? null : user.UserID
                })
            });
    
            if (!response.ok) throw new Error("Failed to ban user");
    
            console.log("User successfully banned.");
    
            // Update state
            setAdminData(prev => ({
                ...prev,
                artists: prev.artists.filter(u => u.Username !== username),
                listeners: prev.listeners.filter(u => u.Username !== username),
                bannedUsers: [
                    ...prev.bannedUsers,
                    {
                        ...user,
                        BannedAt: new Date().toISOString(),
                        Role: isArtist ? "Artist" : "Listener"
                    }
                ]
            }));
        } catch (error) {
            console.error("Error banning user:", error);
        }
    };
    

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setSelectedArtist(null);
    
        if (tab === 'artists') {
            fetchAdminData(setAdminData, API_URL);
        }
    };

    // Render loading state
    if (adminData.loading) {
        return <div className="admin-loading">Loading admin dashboard...</div>;
    }

    // Time period dropdown options
    const timePeriodOptions = [
        { value: 'all', label: 'All Time' },
        { value: 'week', label: 'Past Week' },
        { value: 'month', label: 'Past Month' },
        { value: 'year', label: 'Past Year' }
    ];

    return (
        <div className="admin-container">
            <h1 className="admin-title">Admin Dashboard</h1>
            
            <div className="admin-tabs">
                <button 
                    className={`admin-tab ${activeTab === 'statistics' ? 'active' : ''}`}
                    onClick={() => handleTabChange('statistics')}
                >
                    Statistics
                </button>
                <button 
                    className={`admin-tab ${activeTab === 'artists' ? 'active' : ''}`}
                    onClick={() => handleTabChange('artists')}
                >
                    Artists
                </button>
                <button 
                    className={`admin-tab ${activeTab === 'listeners' ? 'active' : ''}`}
                    onClick={() => handleTabChange('listeners')}
                >
                    Listeners
                </button>
                <button 
                    className={`admin-tab ${activeTab === 'banned-users' ? 'active' : ''}`}
                    onClick={() => handleTabChange('banned-users')}
                >
                    Banned Users
                </button>
                <button 
                    className={`admin-tab ${activeTab === 'banned-songs' ? 'active' : ''}`}
                    onClick={() => handleTabChange('banned-songs')}
                >
                    Banned Songs
                </button>
                <button 
                    className={`admin-tab ${activeTab === 'reported-songs' ? 'active' : ''}`}
                    onClick={() => handleTabChange('reported-songs')}
                >
                    Reported Songs
                </button>
            </div>
            
            {/* Statistics Panel */}
            {activeTab === 'statistics' && (
                <div className="admin-panel">
                    <div className="admin-stats">
                        {calculateStats().map((stat, index) => (
                            <div key={index} className="stat-card">
                                <h2>{stat.name}</h2>
                                <div className="stat-value">{stat.stat}</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            
            {/* Artists Panel */}
            {activeTab === 'artists' && (
                <div className="admin-panel">
                    <div className="admin-table-controls">
                        <div className="admin-search">
                            <input
                                type="text"
                                placeholder="Search artists..."
                                value={filterConfig.artists}
                                onChange={(e) => handleFilterChange('artists', e.target.value)}
                            />
                        </div>
                        <div className="admin-filter-dropdown">
                            <select 
                                value={timePeriodFilter.artists}
                                onChange={(e) => handleTimePeriodChange('artists', e.target.value)}
                                className="admin-dropdown"
                            >
                                {timePeriodOptions.map(option => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    
                    <div className="admin-table-container">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th onClick={() => requestSort('artists', 'Username')}>
                                        Username
                                        {sortConfig.artists.key === 'Username' && (
                                            sortConfig.artists.direction === 'ascending' ? <ArrowUp size={14} /> : <ArrowDown size={14} />
                                        )}
                                    </th>
                                    <th onClick={() => requestSort('artists', 'Email')}>
                                        Email
                                        {sortConfig.artists.key === 'Email' && (
                                            sortConfig.artists.direction === 'ascending' ? <ArrowUp size={14} /> : <ArrowDown size={14} />
                                        )}
                                    </th>
                                    <th onClick={() => requestSort('artists', 'CreatedAt')}>
                                        Created At
                                        {sortConfig.artists.key === 'CreatedAt' && (
                                            sortConfig.artists.direction === 'ascending' ? <ArrowUp size={14} /> : <ArrowDown size={14} />
                                        )}
                                    </th>
                                    <th onClick={() => requestSort('artists', 'StrikeCount')}>
                                        Strike Count
                                        {sortConfig.artists.key === 'StrikeCount' && (
                                            sortConfig.artists.direction === 'ascending' ? <ArrowUp size={14} /> : <ArrowDown size={14} />
                                        )}
                                    </th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {getFilteredData(getSortedData(adminData.artists, 'artists'), 'artists').map((artist, index) => (
                                    <tr key={index}>
                                        <td onClick={() => handleArtistClick(artist)} className="artist-username clickable">
                                            {artist.Username}
                                        </td>
                                        <td>{artist.Email}</td>
                                        <td>{new Date(artist.CreatedAt).toLocaleDateString()}</td>
                                        <td>
                                            <span className={`strike-count ${artist.StrikeCount >= 3 ? 'high' : artist.StrikeCount > 0 ? 'medium' : ''}`}>
                                                {artist.StrikeCount || 0}
                                            </span>
                                        </td>
                                        <td className="action-buttons">
                                            <button 
                                                className="admin-action-btn ban" 
                                                onClick={() => handleUserAction(artist.Username, 'ban')}
                                                title="Ban User"
                                            >
                                                Ban
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    
                    {/* Strike Details Section */}
                    {selectedArtist && (
    <div className="strike-details-container">
        <h3>Strike Details for {selectedArtist.Username}</h3>
        {strikeDetails.length > 0 ? (
            <table className="admin-table strike-details-table">
                <thead>
                    <tr>
                        <th>Strike Date</th>
                        <th>Reason</th>
                        <th>Song</th>
                    </tr>
                </thead>
                <tbody>
                    {strikeDetails.map((strike, index) => (
                        <tr key={index}>
                            <td>{new Date(strike.StrikeDate).toLocaleDateString()}</td>
                            <td>{strike.Reason}</td>
                            <td>{strike.SongName}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        ) : (
            <p className="no-strikes-message">No strike details found for this artist.</p>
        )}
    </div>
)}
                </div>
            )}
            
            {/* Listeners Panel */}
            {activeTab === 'listeners' && (
                <div className="admin-panel">
                    <div className="admin-table-controls">
                        <div className="admin-search">
                            <input
                                type="text"
                                placeholder="Search listeners..."
                                value={filterConfig.listeners}
                                onChange={(e) => handleFilterChange('listeners', e.target.value)}
                            />
                        </div>
                        <div className="admin-filter-dropdown">
                            <select 
                                value={timePeriodFilter.listeners}
                                onChange={(e) => handleTimePeriodChange('listeners', e.target.value)}
                                className="admin-dropdown"
                            >
                                {timePeriodOptions.map(option => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    
                    <div className="admin-table-container">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th onClick={() => requestSort('listeners', 'Username')}>
                                        Username
                                        {sortConfig.listeners.key === 'Username' && (
                                            sortConfig.listeners.direction === 'ascending' ? <ArrowUp size={14} /> : <ArrowDown size={14} />
                                        )}
                                    </th>
                                    <th onClick={() => requestSort('listeners', 'Email')}>
                                        Email
                                        {sortConfig.listeners.key === 'Email' && (
                                            sortConfig.listeners.direction === 'ascending' ? <ArrowUp size={14} /> : <ArrowDown size={14} />
                                        )}
                                    </th>
                                    <th onClick={() => requestSort('listeners', 'CreatedAt')}>
                                        Created At
                                        {sortConfig.listeners.key === 'CreatedAt' && (
                                            sortConfig.listeners.direction === 'ascending' ? <ArrowUp size={14} /> : <ArrowDown size={14} />
                                        )}
                                    </th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {getFilteredData(getSortedData(adminData.listeners, 'listeners'), 'listeners').map((listener, index) => (
                                    <tr key={index}>
                                        <td>{listener.Username}</td>
                                        <td>{listener.Email}</td>
                                        <td>{new Date(listener.CreatedAt).toLocaleDateString()}</td>
                                        <td>
                                            <button 
                                                className="admin-action-btn ban" 
                                                onClick={() => handleUserAction(listener.Username, 'ban')}
                                            >
                                                Ban User
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
            
            {/* Banned Users Panel */}
            {activeTab === 'banned-users' && (
            <div className="admin-panel">
                <div className="admin-table-controls">
                <div className="admin-search">
                    <input
                    type="text"
                    placeholder="Search banned users..."
                    value={filterConfig.bannedUsers}
                    onChange={(e) => handleFilterChange('bannedUsers', e.target.value)}
                    />
                </div>
                <div className="admin-filter-dropdown">
                    <select 
                    value={timePeriodFilter.bannedUsers}
                    onChange={(e) => handleTimePeriodChange('bannedUsers', e.target.value)}
                    className="admin-dropdown"
                    >
                    {timePeriodOptions.map(option => (
                        <option key={option.value} value={option.value}>
                        {option.label}
                        </option>
                    ))}
                    </select>
                </div>
                </div>

                <div className="admin-table-container">
                <table className="admin-table">
                    <thead>
                    <tr>
                        <th onClick={() => requestSort('bannedUsers', 'Username')}>
                        Username
                        {sortConfig.bannedUsers.key === 'Username' && (
                            sortConfig.bannedUsers.direction === 'ascending' ? <ArrowUp size={14} /> : <ArrowDown size={14} />
                        )}
                        </th>
                        <th onClick={() => requestSort('bannedUsers', 'Email')}>
                        Email
                        {sortConfig.bannedUsers.key === 'Email' && (
                            sortConfig.bannedUsers.direction === 'ascending' ? <ArrowUp size={14} /> : <ArrowDown size={14} />
                        )}
                        </th>
                        <th onClick={() => requestSort('bannedUsers', 'BannedAt')}>
                        Banned At
                        {sortConfig.bannedUsers.key === 'BannedAt' && (
                            sortConfig.bannedUsers.direction === 'ascending' ? <ArrowUp size={14} /> : <ArrowDown size={14} />
                        )}
                        </th>
                        <th onClick={() => requestSort('bannedUsers', 'Role')}>
                        Role
                        {sortConfig.bannedUsers.key === 'Role' && (
                            sortConfig.bannedUsers.direction === 'ascending' ? <ArrowUp size={14} /> : <ArrowDown size={14} />
                        )}
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    {getFilteredData(getSortedData(adminData.bannedUsers, 'bannedUsers'), 'bannedUsers').map((user, index) => (
                        <tr key={index}>
                        <td>{user.Username}</td>
                        <td>{user.Email}</td>
                        <td>{new Date(user.BannedAt).toLocaleDateString()}</td>
                        <td>{user.Role}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                </div>
            </div>
            )}
            
            {/* Banned Songs Panel */}
            {activeTab === 'banned-songs' && (
            <div className="admin-panel">
                <div className="admin-table-controls">
                <div className="admin-search">
                    <input
                    type="text"
                    placeholder="Search banned songs..."
                    value={filterConfig.bannedSongs}
                    onChange={(e) => handleFilterChange('bannedSongs', e.target.value)}
                    />
                </div>
                </div>

                <div className="song-cards-container">
                {getFilteredData(adminData.bannedSongs, 'bannedSongs').map(song => (
                    <div className="song-card banned" key={song.SongID}>
                    <div className="song-card-image">
                        <img
                        src={song.CoverArtFileName}
                        alt={song.SongName}
                        onError={(e) => {
                            e.target.src = "/api/placeholder/180/200";
                        }}
                        />
                    </div>
                    <div className="song-card-content">
                        <h3 className="song-title">{song.SongName}</h3>
                        <p className="song-artist">Artist: {song.ArtistUsername}</p>
                        <p className="song-banned-date">
                        Banned on: {new Date(song.ReportedOn).toLocaleDateString()}
                        </p>
                        <p className="song-reason">Reason: {song.Reason}</p>
                    </div>
                    </div>
                ))}
                </div>
            </div>
            )}
                        
            {/* Reported Songs Panel */}
            {activeTab === 'reported-songs' && (
            <div className="admin-panel">
                <div className="admin-table-controls">
                <div className="admin-search">
                    <input
                    type="text"
                    placeholder="Search reported songs..."
                    value={filterConfig.reportedSongs}
                    onChange={(e) => handleFilterChange('reportedSongs', e.target.value)}
                    />
                </div>
                </div>

                <div className="song-cards-container">
                {getFilteredData(adminData.reportedSongs, 'reportedSongs').map((song) => (
                    <div className="song-card reported" key={song.ReportID}>
                    <div className="song-card-image">
                        <img
                        src={song.CoverArtFileName}
                        alt={song.SongName}
                        onError={(e) => {
                            e.target.src = "/api/placeholder/180/200";
                        }}
                        />
                    </div>

                    <div className="song-card-content">
                        <h3 className="song-title">{song.SongName}</h3>
                        <p className="song-artist">Artist: {song.ArtistUsername}</p>
                        <p className="song-reporter">Reported By: {song.ReporterUsername}</p>
                        <p className="song-reason">Reason: {song.Reason}</p>
                        <p className="song-reported-date">
                        Reported On: {new Date(song.CreatedAt).toLocaleDateString()}
                        </p>

                        <div className="song-actions">
                        <button
                            className="admin-action-btn play"
                            onClick={() => handleTogglePlay(song)}
                        >
                            {playingSongId === song.ReportID ? 'Pause' : 'Play'}
                        </button>

                        <button
                            className="admin-action-btn approve"
                            onClick={() =>
                            handleSongAction(song.ReportID, 'approve', 'reported', song.ArtistUsername)
                            }
                        >
                            Dismiss
                        </button>

                        <button
                            className="admin-action-btn ban"
                            onClick={() =>
                            handleSongAction(song.ReportID, 'ban', 'reported', song.ArtistUsername)
                            }
                        >
                            Ban
                        </button>
                        </div>
                    </div>
                    </div>
                ))}
                </div>
            </div>
            )}

            
            {/* Error message if there was an error loading data */}
            {adminData.error && (
                <div className="admin-error-message">
                    <p>There was an error loading the data from the API: {adminData.error}</p>
                    <p>Using mock data for demonstration purposes.</p>
                </div>
            )}
        </div>
    );
};

export default AdminPage;