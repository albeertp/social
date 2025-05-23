import React, { useState, useEffect } from 'react';
import { Heart, MessageCircle, Share2, User, Plus, Home, Search, Bell, Settings, X, Camera, Image, Smile } from 'lucide-react';

export default function SocialNetwork() {
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [activeTab, setActiveTab] = useState('home');
  const [showLogin, setShowLogin] = useState(true);
  const [loginData, setLoginData] = useState({ username: '', name: '', bio: '' });
  const [newComment, setNewComment] = useState({});
  const [showImageModal, setShowImageModal] = useState(false);

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return 'ora';
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    return `${days}g`;
  };

  const handleLogin = () => {
    if (loginData.username && loginData.name) {
      const newUser = {
        id: Date.now(),
        username: loginData.username,
        name: loginData.name,
        bio: loginData.bio,
        followers: 0,
        following: 0,
        avatar: '👤',
        joinDate: new Date()
      };
      setUsers([...users, newUser]);
      setCurrentUser(newUser);
      setShowLogin(false);
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreatePost = () => {
    if ((newPost.trim() || selectedImage) && currentUser) {
      const post = {
        id: Date.now(),
        userId: currentUser.id,
        content: newPost,
        image: selectedImage,
        timestamp: new Date(),
        likes: 0,
        likedBy: [],
        comments: []
      };
      setPosts([post, ...posts]);
      setNewPost('');
      setSelectedImage(null);
    }
  };

  const handleLike = (postId) => {
    if (!currentUser) return;
    
    setPosts(posts.map(post => {
      if (post.id === postId) {
        const isLiked = post.likedBy.includes(currentUser.id);
        return {
          ...post,
          likes: isLiked ? post.likes - 1 : post.likes + 1,
          likedBy: isLiked 
            ? post.likedBy.filter(id => id !== currentUser.id)
            : [...post.likedBy, currentUser.id]
        };
      }
      return post;
    }));
  };

  const handleComment = (postId) => {
    if (!newComment[postId] || !currentUser) return;
    
    setPosts(posts.map(post => {
      if (post.id === postId) {
        const comment = {
          id: Date.now() + Math.random(),
          userId: currentUser.id,
          content: newComment[postId],
          timestamp: new Date()
        };
        return {
          ...post,
          comments: [...post.comments, comment]
        };
      }
      return post;
    }));
    
    setNewComment({ ...newComment, [postId]: '' });
  };

  const getUserById = (id) => users.find(user => user.id === id);

  if (showLogin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
          <div className="absolute bottom-1/4 left-1/2 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
        </div>
        
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 w-full max-w-md shadow-2xl border border-white/20 transform hover:scale-105 transition-all duration-500">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-4 transform hover:rotate-12 transition-transform duration-300">
              <span className="text-2xl">🌟</span>
            </div>
            <h1 className="text-4xl font-bold text-white mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              SocialVibe
            </h1>
            <p className="text-white/70">Connettiti con il mondo intero</p>
          </div>
          
          <div className="space-y-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Username"
                value={loginData.username}
                onChange={(e) => setLoginData({...loginData, username: e.target.value})}
                className="w-full p-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300 hover:bg-white/20"
              />
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="Nome completo"
                value={loginData.name}
                onChange={(e) => setLoginData({...loginData, name: e.target.value})}
                className="w-full p-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300 hover:bg-white/20"
              />
            </div>
            <div className="relative">
              <textarea
                placeholder="Descrivi te stesso..."
                value={loginData.bio}
                onChange={(e) => setLoginData({...loginData, bio: e.target.value})}
                className="w-full p-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/50 focus:ring-2 focus:ring-purple-400 focus:border-transparent h-24 resize-none transition-all duration-300 hover:bg-white/20"
              />
            </div>
            <button
              onClick={handleLogin}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4 rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 hover:shadow-lg active:scale-95"
            >
              🚀 Entra nel Social
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header with glassmorphism effect */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-white/20 sticky top-0 z-50 shadow-lg">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center transform hover:rotate-12 transition-transform duration-300">
              <span className="text-white text-xl">🌟</span>
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              SocialVibe
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3 bg-white/50 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20 hover:bg-white/70 transition-all duration-300">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white text-sm transform hover:scale-110 transition-transform duration-200">
                {currentUser?.name?.charAt(0).toUpperCase()}
              </div>
              <span className="font-medium text-gray-800">{currentUser?.name}</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto flex">
        {/* Animated Sidebar */}
        <aside className="w-72 p-6 sticky top-24 h-fit">
          <div className="bg-white/60 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/20">
            <nav className="space-y-3">
              <button
                onClick={() => setActiveTab('home')}
                className={`w-full flex items-center space-x-4 p-4 rounded-xl transition-all duration-300 transform hover:scale-105 ${
                  activeTab === 'home' 
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg' 
                    : 'hover:bg-white/50 text-gray-700'
                }`}
              >
                <Home size={20} />
                <span className="font-medium">Home</span>
              </button>
              
              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full flex items-center space-x-4 p-4 rounded-xl transition-all duration-300 transform hover:scale-105 ${
                  activeTab === 'profile' 
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg' 
                    : 'hover:bg-white/50 text-gray-700'
                }`}
              >
                <User size={20} />
                <span className="font-medium">Profilo</span>
              </button>
              
              <button
                onClick={() => setActiveTab('search')}
                className={`w-full flex items-center space-x-4 p-4 rounded-xl transition-all duration-300 transform hover:scale-105 ${
                  activeTab === 'search' 
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg' 
                    : 'hover:bg-white/50 text-gray-700'
                }`}
              >
                <Search size={20} />
                <span className="font-medium">Esplora</span>
              </button>
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {activeTab === 'home' && (
            <div className="space-y-8">
              {/* Enhanced Create Post */}
              <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-8 shadow-lg border border-white/20 transform hover:scale-[1.02] transition-all duration-300">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold text-lg transform hover:scale-110 transition-transform duration-200">
                    {currentUser?.name?.charAt(0).toUpperCase()}
                  </div>
                  
                  <div className="flex-1 space-y-4">
                    <textarea
                      value={newPost}
                      onChange={(e) => setNewPost(e.target.value)}
                      placeholder="Condividi quello che pensi..."
                      className="w-full p-4 border-0 bg-transparent text-lg placeholder-gray-500 resize-none focus:ring-0 focus:outline-none"
                      rows="3"
                    />
                    
                    {selectedImage && (
                      <div className="relative">
                        <img 
                          src={selectedImage} 
                          alt="Preview" 
                          className="w-full max-h-64 object-cover rounded-xl shadow-md"
                        />
                        <button
                          onClick={() => setSelectedImage(null)}
                          className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1 hover:bg-black/70 transition-colors"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <div className="flex items-center space-x-4">
                        <label className="flex items-center space-x-2 cursor-pointer group">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                          />
                          <div className="p-2 rounded-lg bg-blue-100 text-blue-600 group-hover:bg-blue-200 transition-colors">
                            <Camera size={20} />
                          </div>
                          <span className="text-sm text-gray-600 group-hover:text-blue-600 transition-colors">Foto</span>
                        </label>
                        
                        <button className="flex items-center space-x-2 p-2 rounded-lg bg-yellow-100 text-yellow-600 hover:bg-yellow-200 transition-colors">
                          <Smile size={20} />
                          <span className="text-sm">Emoji</span>
                        </button>
                      </div>
                      
                      <button
                        onClick={handleCreatePost}
                        disabled={!newPost.trim() && !selectedImage}
                        className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg"
                      >
                        Pubblica ✨
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Posts Feed */}
              {posts.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-24 h-24 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
                    <span className="text-4xl">🎉</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">Benvenuto su SocialVibe!</h3>
                  <p className="text-gray-600">Crea il tuo primo post per iniziare a condividere con il mondo</p>
                </div>
              ) : (
                posts.map((post, index) => {
                  const author = getUserById(post.userId);
                  const isLiked = post.likedBy.includes(currentUser?.id);
                  
                  return (
                    <div 
                      key={post.id} 
                      className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-lg border border-white/20 transform hover:scale-[1.02] transition-all duration-300"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      {/* Post Header */}
                      <div className="p-6">
                        <div className="flex items-center space-x-4 mb-4">
                          <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold transform hover:scale-110 transition-transform duration-200">
                            {author?.name?.charAt(0).toUpperCase() || '?'}
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-900">{author?.name || 'Utente'}</h3>
                            <p className="text-sm text-gray-500">@{author?.username || 'unknown'} · {formatTimestamp(post.timestamp)}</p>
                          </div>
                        </div>
                        
                        {post.content && (
                          <p className="text-gray-800 leading-relaxed mb-4 text-lg">{post.content}</p>
                        )}
                        
                        {post.image && (
                          <div className="mb-4">
                            <img 
                              src={post.image} 
                              alt="Post content" 
                              className="w-full max-h-96 object-cover rounded-xl shadow-md cursor-pointer hover:shadow-lg transition-shadow"
                              onClick={() => setShowImageModal(post.image)}
                            />
                          </div>
                        )}
                      </div>

                      {/* Post Actions */}
                      <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
                        <button
                          onClick={() => handleLike(post.id)}
                          className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 transform hover:scale-110 ${
                            isLiked 
                              ? 'text-red-500 bg-red-50 shadow-md' 
                              : 'text-gray-500 hover:bg-red-50 hover:text-red-500'
                          }`}
                        >
                          <Heart size={20} fill={isLiked ? 'currentColor' : 'none'} className={isLiked ? 'animate-pulse' : ''} />
                          <span className="font-medium">{post.likes}</span>
                        </button>
                        
                        <button className="flex items-center space-x-2 px-4 py-2 rounded-xl text-gray-500 hover:bg-blue-50 hover:text-blue-500 transition-all duration-300 transform hover:scale-110">
                          <MessageCircle size={20} />
                          <span className="font-medium">{post.comments.length}</span>
                        </button>
                        
                        <button className="flex items-center space-x-2 px-4 py-2 rounded-xl text-gray-500 hover:bg-green-50 hover:text-green-500 transition-all duration-300 transform hover:scale-110">
                          <Share2 size={20} />
                        </button>
                      </div>

                      {/* Comments Section */}
                      {post.comments.length > 0 && (
                        <div className="px-6 pb-4 border-t border-gray-100">
                          {post.comments.map(comment => {
                            const commentAuthor = getUserById(comment.userId);
                            return (
                              <div key={comment.id} className="flex items-start space-x-3 mt-4 animate-fade-in">
                                <div className="w-8 h-8 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full flex items-center justify-center text-white text-sm">
                                  {commentAuthor?.name?.charAt(0).toUpperCase() || '?'}
                                </div>
                                <div className="flex-1 bg-gray-50 rounded-xl p-3 hover:bg-gray-100 transition-colors">
                                  <div className="flex items-center space-x-2 mb-1">
                                    <span className="font-medium text-sm">{commentAuthor?.name || 'Utente'}</span>
                                    <span className="text-xs text-gray-500">{formatTimestamp(comment.timestamp)}</span>
                                  </div>
                                  <p className="text-sm text-gray-800">{comment.content}</p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {/* Add Comment */}
                      <div className="px-6 pb-6 border-t border-gray-100">
                        <div className="flex items-center space-x-3 mt-4">
                          <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white text-sm">
                            {currentUser?.name?.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1 flex space-x-2">
                            <input
                              type="text"
                              value={newComment[post.id] || ''}
                              onChange={(e) => setNewComment({...newComment, [post.id]: e.target.value})}
                              placeholder="Scrivi un commento..."
                              className="flex-1 p-3 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-purple-400 focus:bg-white transition-all duration-300"
                            />
                            <button
                              onClick={() => handleComment(post.id)}
                              disabled={!newComment[post.id]}
                              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 active:scale-95"
                            >
                              Invia
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-lg border border-white/20 p-8 transform hover:scale-[1.01] transition-all duration-300">
              <div className="text-center mb-8">
                <div className="w-24 h-24 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4 transform hover:scale-110 transition-transform duration-300 shadow-lg">
                  {currentUser?.name?.charAt(0).toUpperCase()}
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">{currentUser?.name}</h2>
                <p className="text-gray-600 text-lg">@{currentUser?.username}</p>
                {currentUser?.bio && (
                  <p className="mt-4 text-gray-700 bg-gray-50 rounded-xl p-4 max-w-md mx-auto">{currentUser.bio}</p>
                )}
              </div>
              
              <div className="flex justify-center space-x-12 py-6 border-y border-gray-200">
                <div className="text-center transform hover:scale-110 transition-transform duration-300">
                  <div className="text-2xl font-bold text-purple-600">{posts.filter(p => p.userId === currentUser?.id).length}</div>
                  <div className="text-sm text-gray-500 font-medium">Post</div>
                </div>
                <div className="text-center transform hover:scale-110 transition-transform duration-300">
                  <div className="text-2xl font-bold text-pink-600">{currentUser?.followers}</div>
                  <div className="text-sm text-gray-500 font-medium">Follower</div>
                </div>
                <div className="text-center transform hover:scale-110 transition-transform duration-300">
                  <div className="text-2xl font-bold text-indigo-600">{currentUser?.following}</div>
                  <div className="text-sm text-gray-500 font-medium">Seguiti</div>
                </div>
              </div>

              <div className="mt-8">
                <h3 className="font-bold text-gray-900 text-xl mb-6">I tuoi post</h3>
                {posts.filter(post => post.userId === currentUser?.id).length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">📝</span>
                    </div>
                    <p className="text-gray-500">Non hai ancora pubblicato nulla</p>
                  </div>
                ) : (
                  posts.filter(post => post.userId === currentUser?.id).map(post => (
                    <div key={post.id} className="border border-gray-200 rounded-xl p-6 mb-4 hover:shadow-md transition-all duration-300 transform hover:scale-[1.02] bg-white/50">
                      {post.content && <p className="text-gray-800 mb-3 text-lg">{post.content}</p>}
                      {post.image && (
                        <img src={post.image} alt="Post" className="w-full max-h-48 object-cover rounded-lg mb-3" />
                      )}
                      <div className="flex items-center space-x-6 text-sm text-gray-500">
                        <span className="font-medium">{formatTimestamp(post.timestamp)}</span>
                        <span className="flex items-center space-x-1">
                          <Heart size={16} />
                          <span>{post.likes}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <MessageCircle size={16} />
                          <span>{post.comments.length}</span>
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'search' && (
            <div className="space-y-8">
              <div className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-lg border border-white/20 p-8 transform hover:scale-[1.01] transition-all duration-300">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Scopri nuove persone</h2>
                {users.filter(user => user.id !== currentUser?.id).length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                      <span className="text-3xl">👥</span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Nessun altro utente</h3>
                    <p className="text-gray-600">Invita i tuoi amici a unirsi a SocialVibe!</p>
                  </div>
                ) : (
                  users.filter(user => user.id !== currentUser?.id).map(user => (
                    <div key={user.id} className="flex items-center justify-between p-6 hover:bg-white/50 rounded-xl transition-all duration-300 transform hover:scale-[1.02] border border-transparent hover:border-purple-200 mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full flex items-center justify-center text-white font-bold transform hover:scale-110 transition-transform duration-200">
                          {user.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900">{user.name}</h3>
                          <p className="text-sm text-gray-500">@{user.username}</p>
                          {user.bio && <p className="text-sm text-gray-600 mt-1 max-w-md">{user.bio}</p>}
                        </div>
                      </div>
                      <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg">
                        Segui
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Image Modal */}
      {showImageModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in" onClick={() => setShowImageModal(false)}>
          <div className="relative max-w-4xl max-h-full transform animate-scale-in">
            <img 
              src={showImageModal} 
              alt="Enlarged" 
              className="max-w-full max-h-full object-contain rounded-xl shadow-2xl"
            />
            <button
              onClick={() => setShowImageModal(false)}
              className="absolute top-4 right-4 bg-black/50 text-white rounded-full p-2 hover:bg-black/70 transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes scale-in {
          from { transform: scale(0.8); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.4; }
        }
        
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
        
        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 4s infinite;
        }
      `}</style>
    </div>
  );
}