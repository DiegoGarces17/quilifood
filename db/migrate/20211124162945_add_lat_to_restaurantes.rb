class AddLatToRestaurantes < ActiveRecord::Migration[6.1]
  def change
    add_column :restaurantes, :lat, :float
  end
end
