class TaskPolicy < ApplicationPolicy
  attr_reader :user, :task

  MANAGER_ATTRS = [:name, :description, :state_event, :expired_at]
  DEVELOPER_ATTRS = [:assignee_id, :state_event]
  ADMIN_ATTRS = MANAGER_ATTRS + DEVELOPER_ATTRS + [:author_id]

  def create?
    user.admin? || user.manager?
  end

  def destroy?
    user.admin? || (user.manager? && user.author_of?(task))
  end

  def permitted_attributes_for_update
    if user.admin?
      ADMIN_ATTRS
    elsif user.manager?
      MANAGER_ATTRS - [:state_event]
    elsif user.developer?
      user.assignee_of?(task) ? DEVELOPER_ATTRS : DEVELOPER_ATTRS - [:state_event]
    end
  end

  def permitted_attributes_for_create
    user.admin? ? ADMIN_ATTRS : MANAGER_ATTRS
  end

  def assignee_valid?(assignee_id)
    assignee_id.present? && Developer.exists?(assignee_id)
  end

  def author_valid?(author_id)
    author_id.present? && Manager.exists?(author_id)
  end

  def validate(attrs)
    attrs.delete(:assignee_id) unless assignee_valid?(attrs[:assignee_id])
    attrs.delete(:author_id) unless author_valid?(attrs[:author_id])
    attrs
  end
end
