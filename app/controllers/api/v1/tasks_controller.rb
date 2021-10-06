class Api::V1::TasksController < Api::V1::ApplicationController
  def index
    tasks = Task.all.
      ransack(ransack_params).
      result.
      page(page).
      per(per_page)

    respond_with(tasks, each_serializer: TaskSerializer, root: 'items', meta: build_meta(tasks))
  end

  def show
    task = Task.find(params[:id])

    respond_with(task, serializer: TaskSerializer)
  end

  def create
    authorize(Task)

    attrs = permitted_attributes(Task)

    task = if current_user.manager?
             current_user.my_tasks.new(attrs)
           else
             Task.new(validate(attrs))
           end

    task.save

    respond_with(task, serializer: TaskSerializer, location: nil)
  end

  def update
    task = Task.find(params[:id])

    attrs = permitted_attributes(task)

    task.update(validate(attrs))

    respond_with(task, serializer: TaskSerializer)
  end

  def destroy
    task = Task.find(params[:id])
    authorize(task)
    task.destroy

    respond_with(task)
  end

  private

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
