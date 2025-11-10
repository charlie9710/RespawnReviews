package com.rr.respawnReviews.service;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Base64;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.rr.respawnReviews.exceptions.NoPostFoundException;
import com.rr.respawnReviews.model.Game;
import com.rr.respawnReviews.model.Post;
import com.rr.respawnReviews.model.User;
import com.rr.respawnReviews.repository.PostRepository;

import io.micrometer.common.lang.Nullable;

@Service
public class PostService {
    @Autowired
    private PostRepository postRepository;

    @Autowired
    private GameService gameService;

    @Autowired
    private UserService userService;

    public Post createPost (String title, String content,
      @Nullable MultipartFile imageFile, String type, Long userId, Long gameId,@Nullable String gameName, @Nullable String gameRelease) throws  java.io.IOException{

        Game game = gameService.getGameById(gameId);

        if (game == null) {
            game = new Game();
            game.setId(gameId); 
            game.setName(gameName != null ? gameName : "Nombre por defecto");
            if(gameRelease!=null){
                String dateString = gameRelease;
                DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
                LocalDate date = LocalDate.parse(dateString, formatter);

                game.setReleaseDate(date);
            }
            gameService.saveGame(game);
        }


        User usuario = userService.findUser(userId);

        Post post = new Post();
        post.setTitle(title);
        post.setContent(content);
        post.setType(type);
        post.setImg("");
        post.setGame(game);
        post.setUser(usuario); 
        post.setOwnerName(usuario.getUsername());

        String fileName = null;
        if (imageFile != null) {
            fileName = UUID.randomUUID() + "_" + imageFile.getOriginalFilename();
            Path uploadsDir = Paths.get("uploads");
            Files.createDirectories(uploadsDir);
            Path path = uploadsDir.resolve(fileName);
            Files.copy(imageFile.getInputStream(), path);
        }

        StringBuffer contentBuffer = new StringBuffer();
        Pattern myPattern = Pattern.compile("\"data:image[^\"]*\"");
        Matcher myMatcher = myPattern.matcher(post.getContent());

        while(myMatcher.find()){
            String fileNameContent = UUID.randomUUID() + "_" + post.getUser().getId() + ".png";

            Path uploadsDir = Paths.get("uploads");

            Files.createDirectories(uploadsDir);

            Path path = uploadsDir.resolve(fileNameContent);

            String base64Data = myMatcher.group().replaceAll("^\"|\"$", ""); 
            base64Data = base64Data.split(",")[1].trim(); 
            byte[] decodedImg = Base64.getDecoder().decode(base64Data);
            Files.write(path, decodedImg);
            myMatcher.appendReplacement(contentBuffer, "\"" + fileNameContent + "\"");
        }
        
        myMatcher.appendTail(contentBuffer);
        post.setContent(contentBuffer.toString());
        post.setImg(fileName);
            

        return postRepository.save(post);
    }


    public Post getPostById (Long id){
        Optional<Post> newPost = postRepository.findById(id);
        if(newPost.isPresent()){
            return newPost.get();
        }else{
            throw new NoPostFoundException("No hay post con el id asociado");
        }
    }
    
    public List<Post> getPostsByGameType (String type, Long id){
        return postRepository.findByTypeAndGameId(type, id);
    }

    public List<Post> getPostsByUser(Long id){
        return postRepository.findByUser(id);
    }

}
