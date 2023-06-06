class Api::V1::TasksController < Api::V1::ApplicationController
  def index
    tasks = Task.all.
      with_attached_image.
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

    if task.save 
      SendTaskCreateNotificationJob.perform_async(task.id)
    end  

    respond_with(task, serializer: TaskSerializer, location: nil)
  end

  def update
    task = Task.find(params[:id])

    attrs = permitted_attributes(task)

    if task.update(validate(attrs))
      SendTaskUpdateNotificationJob.perform_async(task.id)
    end

    respond_with(task, serializer: TaskSerializer)
  end

  def destroy
    task = Task.find(params[:id])
    authorize(task)

    if task.destroy
      SendTaskDeleteNotificationJob.perform_async(task.id, task.author.id)
    end

    respond_with(task)
  end

  def attach_image
    authorize(Task)
    task = Task.find(params[:id])
    task_attach_image_form = TaskAttachImageForm.new(attachment_params)

    if task_attach_image_form.invalid?
      respond_with task_attach_image_form
      return
    end
  
    image = task_attach_image_form.processed_image
    task.image.attach(image)
  
    respond_with(task, serializer: TaskSerializer)
  end
  
  def remove_image
    authorize(Task)
    task = Task.find(params[:id])
    task.image.purge
    
    respond_with(task, serializer: TaskSerializer)
  end

  private

  def attachment_params
    params.require(:attachment).permit(:image, :crop_x, :crop_y, :crop_width, :crop_height)
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
