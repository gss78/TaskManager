class User < ApplicationRecord
  has_secure_password
  has_many :my_tasks, class_name: 'Task', foreign_key: :author_id
  has_many :assigned_tasks, class_name: 'Task', foreign_key: :assignee_id
  validates :first_name, :last_name, :email, presence: true
  validates :first_name, :last_name, length: { minimum: 2 }
  VALID_EMAIL_REGEX = /\A[\w+\-.]+@[a-z\d\-]+\.[a-z]+\z/i.freeze
  validates :email, format: { with: VALID_EMAIL_REGEX }
  validates :email, uniqueness: true
  attr_accessor :reset_token

  PASSWORD_RESET_TOKEN_EXPIRATION_IN_HOURS = 24

  def admin?
    is_a?(Admin)
  end

  def developer?
    is_a?(Developer)
  end

  def manager?
    is_a?(Manager)
  end

  def assignee_of?(task)
    task.try(:assignee) == self
  end

  def author_of?(task)
    task.try(:author) == self
  end

  # Sets the password reset attributes.
  def create_reset_digest
    self.reset_token = User.new_token
    update_attribute(:reset_digest, User.digest(reset_token))
    update_attribute(:reset_sent_at, Time.zone.now)
  end

  # Returns a random token.
  def User.new_token 
    SecureRandom.urlsafe_base64
  end

  # Returns the hash digest of the given string.
  def User.digest(string)
    cost = ActiveModel::SecurePassword.min_cost ? BCrypt::Engine::MIN_COST : BCrypt::Engine.cost
    BCrypt::Password.create(string, cost: cost)
  end

  # Sends password reset email.
  def send_password_reset_email 
    UserMailer.password_reset(self).deliver_now
  end

  # Returns true if a password reset has expired. 
  def password_reset_expired?
    reset_sent_at < PASSWORD_RESET_TOKEN_EXPIRATION_IN_HOURS.hours.ago
  end

  # Returnss true if user authenticated by token
  def authenticated?(attribute, token)
    digest = send("#{attribute}_digest")
    return false if digest.nil?   
    BCrypt::Password.new(digest).is_password?(token)
  end

  def clear_reset_data
    update_attribute(:reset_digest, nil)
    update_attribute(:reset_sent_at, nil)
  end

    
end
