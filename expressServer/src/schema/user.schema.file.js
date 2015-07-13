var User = function(name, email, password) {
    this.name = name || '';
    this.email = email || '';
    this.role = 'user';
    this.password = password || '';
    this.provider = 'local';
    this.salt = '';
    this.facebook = {};
    this.twitter = {};
    this.google = {};
    this.github= {};
};

module.exports = User;
