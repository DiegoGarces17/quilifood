class AddTelefonoToRestaurante < ActiveRecord::Migration[6.1]
  def change
    add_column :restaurantes, :telefono, :integer
  end
end
