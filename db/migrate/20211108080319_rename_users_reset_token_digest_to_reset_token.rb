class RenameUsersResetTokenDigestToResetToken < ActiveRecord::Migration[6.1]
  def change
    rename_column :users, :reset_digest, :reset_token
  end
end
