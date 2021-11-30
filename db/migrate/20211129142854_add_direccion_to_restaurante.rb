class AddDireccionToRestaurante < ActiveRecord::Migration[6.1]
  def change
    add_column :restaurantes, :direccion, :string
  end
end
