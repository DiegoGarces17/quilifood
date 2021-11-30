class AddLngToRestaurantes < ActiveRecord::Migration[6.1]
  def change
    add_column :restaurantes, :lng, :float
  end
end
