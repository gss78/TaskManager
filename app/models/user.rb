class User < ApplicationRecord
  has_secure_password
  has_many :my_tasks, class_name: 'Task', foreign_key: :author_id
  has_many :assigned_tasks, class_name: 'Task', foreign_key: :assignee_id
  validates :first_name, :last_name, :email, presence: true
  validates :first_name, :last_name, length: { minimum: 2 }
  VALID_EMAIL_REGEX = /\A[\w+\-.]+@[a-z\d\-]+\.[a-z]+\z/i.freeze
  validates :email, format: { with: VALID_EMAIL_REGEX }
  validates :email, uniqueness: true

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
end
