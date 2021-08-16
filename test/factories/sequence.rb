FactoryBot.define do
  sequence :string, aliases: [:state, :description, :name, :first_name, :last_name, :password, :avatar] do |n|
    "string#{n}"
  end

  sequence :email do |n|
    "person#{n}@example.com"
  end

  sequence :type, ['Admin', 'Manager', 'Developer'].cycle

  sequence :date, aliases: [:expired_at] do
    Date.today + rand(10..20)
  end
end
