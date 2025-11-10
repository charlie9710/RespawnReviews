package com.rr.respawnReviews;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.rr.respawnReviews.model.PermissionEntity;
import com.rr.respawnReviews.model.RoleEntity;
import com.rr.respawnReviews.model.User;
import com.rr.respawnReviews.repository.UserRepository;

@SpringBootApplication
public class RespawnReviewsApplication {

	public static void main(String[] args) {
		SpringApplication.run(RespawnReviewsApplication.class, args);
	}
	@Autowired
	PasswordEncoder passwordEncoder;
	@Bean
		CommandLineRunner commandLineRunner(UserRepository userRepository) {
			return args -> {
				PermissionEntity createPermission_create = new PermissionEntity();
				createPermission_create.setName("CREATE");

				PermissionEntity createPermission_read = new PermissionEntity();
				createPermission_read.setName("READ");


				PermissionEntity createPermission_delete = new PermissionEntity();
				createPermission_delete.setName("DELETE");

				RoleEntity roleUser = new RoleEntity();
				roleUser.setRoleName(com.rr.respawnReviews.model.RoleEnum.USER);
				roleUser.getPermissionsList().add(createPermission_create);
				roleUser.getPermissionsList().add(createPermission_read);
				roleUser.getPermissionsList().add(createPermission_delete);



				User user = new User();
				user.setUsername("admin");
				user.setEmail("admin@admin.com");
				user.setPassword(passwordEncoder.encode("admin123"));
				user.setPhone_number(1234567890L);
				user.setName("admin");
				user.setEnabled(true);
				user.setAccountNoExpired(true);
				user.setAccountNoLocked(true);
				user.setCredentialNoExpired(true);
				user.getRoles().add(roleUser);

				userRepository.save(user);
			};
		}

}
