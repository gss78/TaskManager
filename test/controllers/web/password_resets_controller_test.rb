require "test_helper"

class Web::PasswordResetsControllerTest < ActionController::TestCase

  test 'should get new' do
    get :new
    assert_response :success
  end

  test 'should post create' do
    user = create(:user)
    attrs = {
      email: user.email,
    }
    post :create, params: { user: attrs }
    assert_not flash.empty?
    assert_redirected_to root_url
  end

  test 'should patch update' do
    user = create(:user)
    user.prepare_reset_data
    attrs = {
      use_route: 'password_resets',
      id: user.reset_token,
      email: user.email,
      user: 
        { 
          password: '123',
          password_confirmation: '123'
        }
    }
    patch :update, params: attrs
    assert_redirected_to root_url
    assert_not flash.empty?
  end

end
