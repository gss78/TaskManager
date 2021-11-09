class User < ApplicationRecord
  has_secure_password
  has_secure_token :reset_token
  has_many :my_tasks, class_name: 'Task', foreign_key: :author_id
  has_many :assigned_tasks, class_name: 'Task', foreign_key: :assignee_id
  validates :first_name, :last_name, :email, presence: true
  validates :first_name, :last_name, length: { minimum: 2 }
  VALID_EMAIL_REGEX = /\A[\w+\-.]+@[a-z\d\-]+\.[a-z]+\z/i.freeze
  validates :email, format: { with: VALID_EMAIL_REGEX }
  validates :email, uniqueness: true

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

  def prepare_reset_data
    regenerate_reset_token
    update_attribute(:reset_sent_at, Time.zone.now)
  end

  def send_password_reset_email 
    UserMailer.password_reset(self).deliver_later
  end

  def password_reset_expired?
    reset_sent_at < PASSWORD_RESET_TOKEN_EXPIRATION_IN_HOURS.hours.ago
  end

  def authenticated?(token)
    self == User.find_by(reset_token: token)
  end

  def clear_reset_data
    update({
        reset_token:nil, 
        reset_sent_at:nil,
        })
  end

    
end
