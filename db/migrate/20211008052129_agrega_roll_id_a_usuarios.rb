class AgregaRollIdAUsuarios < ActiveRecord::Migration[6.1]
  def change
    add_column :usuarios, :rol_id, :integer, default: 2
    add_foreign_key :usuarios, :roles
  end
end
