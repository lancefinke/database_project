import React, { useState, useEffect } from 'react';
import { Play, Pause, ArrowUp, ArrowDown, Filter, ChevronDown } from "lucide-react";
import UserLink from "../UserLink/UserLink";
import "./Admin.css"; // Using your existing Admin.css

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

    // Add a new state to track the selected artist for strike details
    const [selectedArtist, setSelectedArtist] = useState(null);

    // Your existing API URL
    const API_URL = "https://localhost:7152/";

    useEffect(() => {
        const fetchAdminData = async () => {
            try {
                // Try to fetch data, but handle CORS errors gracefully
                try {
                    const userReportResponse = await fetch(API_URL + "api/Users/GenerateUserReport", {
                        method: "GET",
                        headers: {
                            'Accept': 'application/json'
                        },
                        // Add a mode property to handle CORS issues
                        mode: 'cors' // Try with explicit cors mode
                    });

                    if (!userReportResponse.ok) {
                        throw new Error('Network response was not ok');
                    }

                    const userReportResult = await userReportResponse.json();
                    
                    // If we successfully got data, use it
                    setAdminData({
                        artists: userReportResult.Artists || [],
                        listeners: userReportResult.Listeners || [],
                        bannedUsers: [],
                        bannedSongs: [],
                        reportedSongs: [],
                        loading: false,
                        error: null
                    });
                    
                    return; // Exit early if the API call succeeds
                } catch (fetchError) {
                    // If API call fails (likely due to CORS), continue with mock data
                    console.warn("API call failed, using mock data:", fetchError);
                }

                // Mock data as fallback when API call fails
                const mockArtists = [
                    { Username: "JohnDoe", Email: "john@example.com", CreatedAt: "2024-10-15T12:00:00", StrikeCount: 1 },
                    { Username: "AliceSmith", Email: "alice@example.com", CreatedAt: "2024-11-22T09:15:00", StrikeCount: 0 },
                    { Username: "MusicMaster", Email: "master@music.com", CreatedAt: "2025-01-05T14:30:00", StrikeCount: 2 },
                    { Username: "SongWriter", Email: "writer@example.com", CreatedAt: "2025-02-10T08:45:00", StrikeCount: 3 },
                    { Username: "BeatProducer", Email: "beats@example.com", CreatedAt: "2025-03-15T17:20:00", StrikeCount: 0 }
                ];
                
                const mockListeners = [
                    { Username: "FanUser1", Email: "fan1@example.com", CreatedAt: "2024-09-10T10:20:00" },
                    { Username: "MusicLover", Email: "lover@music.com", CreatedAt: "2024-12-18T16:45:00" },
                    { Username: "RhythmFan", Email: "rhythm@example.com", CreatedAt: "2025-02-28T08:30:00" },
                    { Username: "JazzEnthusiast", Email: "jazz@example.com", CreatedAt: "2025-03-05T14:10:00" },
                    { Username: "ClassicalFan", Email: "classic@example.com", CreatedAt: "2025-04-01T11:55:00" }
                ];
                
                const mockBannedUsers = [
                    { Username: "bannedUser1", Email: "banned1@example.com", CreatedAt: "2024-08-15T12:00:00", BannedAt: "2025-03-10T09:30:00", Reason: "Terms of Service violation" },
                    { Username: "bannedUser2", Email: "banned2@example.com", CreatedAt: "2024-10-22T14:22:00", BannedAt: "2025-03-28T16:45:00", Reason: "Inappropriate content" },
                    { Username: "bannedUser3", Email: "banned3@example.com", CreatedAt: "2025-01-18T09:35:00", BannedAt: "2025-04-05T13:20:00", Reason: "Repeated copyright violations" }
                ];
                
                const mockBannedSongs = [
                    { id: 1, title: "Inappropriate Song", artist: "bannedArtist1", image: "/path/to/image1.jpg", bannedAt: "2025-03-15", reason: "Explicit content" },
                    { id: 2, title: "Copyright Violation", artist: "bannedArtist2", image: "/path/to/image2.jpg", bannedAt: "2025-04-01", reason: "Copyright infringement" }
                ];
                
                const mockReportedSongs = [
                    { id: 1, title: "Controversial Song", artist: "reportedArtist1", image: "/path/to/image3.jpg", reportedAt: "2025-04-10", reason: "Potentially harmful content", reporter: "concerned_user" },
                    { id: 2, title: "Questionable Lyrics", artist: "reportedArtist2", image: "/path/to/image4.jpg", reportedAt: "2025-04-12", reason: "Inappropriate language", reporter: "content_moderator" }
                ];

                setAdminData({
                    artists: mockArtists,
                    listeners: mockListeners,
                    bannedUsers: mockBannedUsers,
                    bannedSongs: mockBannedSongs,
                    reportedSongs: mockReportedSongs,
                    loading: false,
                    error: null
                });

            } catch (error) {
                console.error("Error fetching admin data:", error);
                setAdminData(prev => ({
                    ...prev,
                    loading: false,
                    error: error.message
                }));
            }
        };

        fetchAdminData();
    }, []);

    // Add this function to handle clicking on an artist
    const handleArtistClick = (artist) => {
        // Toggle selection - if same artist is clicked, clear selection
        if (selectedArtist && selectedArtist.Username === artist.Username) {
            setSelectedArtist(null);
        } else {
            setSelectedArtist(artist);
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
    const handleSongAction = (id, action, songType, artistUsername) => {
        // In a real implementation, this would make an API call
        console.log(`${action} song with ID: ${id} by artist: ${artistUsername}`);
        
        // Update local state for UI feedback
        if (songType === 'reported' && action === 'approve') {
            setAdminData(prev => ({
                ...prev,
                reportedSongs: prev.reportedSongs.filter(song => song.id !== id)
            }));
        } else if (songType === 'reported' && action === 'ban') {
            // Move from reported to banned
            const songToBan = adminData.reportedSongs.find(song => song.id === id);
            if (songToBan) {
                // Find the artist and update their strike count
                setAdminData(prev => {
                    // Update artist strike count
                    const updatedArtists = prev.artists.map(artist => 
                        artist.Username === songToBan.artist 
                            ? { ...artist, StrikeCount: (artist.StrikeCount || 0) + 1 } 
                            : artist
                    );
                    
                    return {
                        ...prev,
                        artists: updatedArtists,
                        reportedSongs: prev.reportedSongs.filter(song => song.id !== id),
                        bannedSongs: [...prev.bannedSongs, { ...songToBan, bannedAt: new Date().toISOString().split('T')[0] }]
                    };
                });
            }
        } 
    };

    // Handle user action
    const handleUserAction = (username, action) => {
        // In a real implementation, this would make an API call
        console.log(`${action} user: ${username}`);
        
        // Update local state for UI feedback
        if (action === 'ban') {
            // Find user in either artists or listeners
            const artistToBan = adminData.artists.find(user => user.Username === username);
            const listenerToBan = adminData.listeners.find(user => user.Username === username);
            const userToBan = artistToBan || listenerToBan;
            
            if (userToBan) {
                setAdminData(prev => ({
                    ...prev,
                    artists: prev.artists.filter(user => user.Username !== username),
                    listeners: prev.listeners.filter(user => user.Username !== username),
                    bannedUsers: [...prev.bannedUsers, { 
                        ...userToBan, 
                        BannedAt: new Date().toISOString(), 
                        Reason: "Admin action" 
                    }]
                }));
            }
        }
    };

    // Toggle between tabs
    const handleTabChange = (tab) => {
        setActiveTab(tab);
        // Reset selected artist when changing tabs
        setSelectedArtist(null);
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
                            {selectedArtist.StrikeCount > 0 ? (
                                <table className="admin-table strike-details-table">
                                    <thead>
                                        <tr>
                                            <th>Strike Date</th>
                                            <th>Reason</th>
                                            <th>Song</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {/* Mock strike data - in real app, you'd fetch this from API */}
                                        {Array.from({ length: selectedArtist.StrikeCount || 0 }).map((_, index) => (
                                            <tr key={index}>
                                                <td>{new Date(Date.now() - (index * 30 * 24 * 60 * 60 * 1000)).toLocaleDateString()}</td>
                                                <td>{["Inappropriate content", "Copyright violation", "Terms of service violation"][index % 3]}</td>
                                                <td>{`Banned Song ${index + 1}`}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <p className="no-strikes-message">This artist has no strikes.</p>
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
                                    <th>Reason</th>
                                    {/* Actions column removed */}
                                </tr>
                            </thead>
                            <tbody>
                                {getFilteredData(getSortedData(adminData.bannedUsers, 'bannedUsers'), 'bannedUsers').map((user, index) => (
                                    <tr key={index}>
                                        <td>{user.Username}</td>
                                        <td>{user.Email}</td>
                                        <td>{new Date(user.BannedAt).toLocaleDateString()}</td>
                                        <td>{user.Reason}</td>
                                        {/* Actions column removed */}
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
                            <div className="song-card banned" key={song.id}>
                                <div className="song-card-image">
                                    <img src={song.image} alt={song.title} onError={(e) => {
                                        e.target.src = "/api/placeholder/180/200"; // Fallback image
                                    }} />
                                </div>
                                <div className="song-card-content">
                                    <h3 className="song-title">{song.title}</h3>
                                    <p className="song-artist">{song.artist}</p>
                                    <p className="song-banned-date">Banned on: {song.bannedAt}</p>
                                    <p className="song-reason">Reason: {song.reason}</p>
                                    <div className="song-actions">
                                        {/* No unban button as requested */}
                                    </div>
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
                        {getFilteredData(adminData.reportedSongs, 'reportedSongs').map(song => (
                            <div className="song-card reported" key={song.id}>
                                <div className="song-card-image">
                                    <img src={song.image} alt={song.title} onError={(e) => {
                                        e.target.src = "/api/placeholder/180/200"; // Fallback image
                                    }} />
                                </div>
                                <div className="song-card-content">
                                    <h3 className="song-title">{song.title}</h3>
                                    <p className="song-artist">{song.artist}</p>
                                    <p className="song-reported-date">Reported on: {song.reportedAt}</p>
                                    <p className="song-reporter">Reported by: {song.reporter}</p>
                                    <p className="song-reason">Reason: {song.reason}</p>
                                    <div className="song-actions">
                                        <button 
                                            className="admin-action-btn approve" 
                                            onClick={() => handleSongAction(song.id, 'approve', 'reported')}
                                        >
                                            Dismiss Report
                                        </button>
                                        <button 
                                            className="admin-action-btn ban" 
                                            onClick={() => handleSongAction(song.id, 'ban', 'reported', song.artist)}
                                        >
                                            Ban Song
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