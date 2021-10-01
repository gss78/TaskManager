require 'test_helper'

class Api::V1::TasksControllerTest < ActionController::TestCase
  test 'should get show' do
    author = create(:user)
    task = create(:task, author: author)
    get :show, params: { id: task.id, format: :json }
    assert_response :success
  end

  test 'should get index' do
    get :index, params: { format: :json }
    assert_response :success
  end

  test 'should post create admin' do
    user = create(:admin)
    sign_in(user)
    author = create(:manager)
    assignee = create(:developer)
    task_attributes = attributes_for(:task).
      merge({ assignee_id: assignee.id, author_id: author.id })
    post :create, params: { task: task_attributes, format: :json }
    assert_response :created

    data = JSON.parse(response.body)
    created_task = Task.find(data['task']['id'])

    assert created_task.present?
    assert_equal task_attributes.stringify_keys, created_task.slice(*task_attributes.keys)
  end

  test 'should post create developer' do
    user = create(:developer)
    sign_in(user)
    author = create(:manager)
    assignee = create(:developer)
    task_attributes = attributes_for(:task).
      merge({ assignee_id: assignee.id, author_id: author.id })
    post :create, params: { task: task_attributes, format: :json }
    assert_response :forbidden

  end

  test 'should post create manager' do
    user = create(:manager)
    sign_in(user)
    author = create(:manager)
    assignee = create(:developer)
    task_attributes = attributes_for(:task).
      merge({author_id: user.id })
    post :create, params: { task: task_attributes, format: :json }
    assert_response :created

    data = JSON.parse(response.body)
    created_task = Task.find(data['task']['id'])

    assert created_task.present?
    assert_equal task_attributes.stringify_keys, created_task.slice(*task_attributes.keys)

  end

  test 'should put update admin' do
    user = create(:admin)
    sign_in(user)
    assignee = create(:developer)
    author = create(:manager)
    task = create(:task, author: author)
    task_attributes = attributes_for(:task).
      merge({ author_id: author.id, assignee_id: assignee.id }).
      stringify_keys

    patch :update, params: { id: task.id, format: :json, task: task_attributes }
    assert_response :success

    task.reload
    assert_equal task.slice(*task_attributes.keys), task_attributes
  end

  test 'should put update manager' do
    user = create(:manager)
    sign_in(user)
    assignee = create(:developer)
    
    task = create(:task, author: user)
    task_attributes = attributes_for(:task).
      merge({ author_id: user.id }).
      stringify_keys

    patch :update, params: { id: task.id, format: :json, task: task_attributes }
    assert_response :success

    task.reload
    assert_equal task.slice(*task_attributes.keys), task_attributes
  end

  test 'should put update developer' do
    user = create(:developer)
    sign_in(user)
    assignee = create(:developer)
    author = create(:manager)
    
    task = create(:task, author: author)
    task_attributes = attributes_for(:task).
      merge({ name: task.name, description: task.description, expired_at: task.expired_at, assignee_id: user.id }).
      stringify_keys

    patch :update, params: { id: task.id, format: :json, task: task_attributes }
    assert_response :success

    task.reload
    assert_equal task.slice(*task_attributes.keys), task_attributes
  end

  test 'should delete destroy admin' do
    user = create(:admin)
    sign_in(user)
    author = create(:manager)
    task = create(:task, author: author)
    delete :destroy, params: { id: task.id, format: :json }
    assert_response :success

    assert !Task.where(id: task.id).exists?
  end

  test 'should delete destroy manager' do
    author = create(:manager)
    sign_in(author)
    task = create(:task, author: author)  
    
    delete :destroy, params: { id: task.id, format: :json }
    assert_response :success

    assert !Task.where(id: task.id).exists?
  end

  test 'should delete destroy developer' do
    user = create(:developer)
    author = create(:manager)
    sign_in(user)
    task = create(:task, author: author)  
    
    delete :destroy, params: { id: task.id, format: :json }
    assert_response :forbidden
    
  end

end
