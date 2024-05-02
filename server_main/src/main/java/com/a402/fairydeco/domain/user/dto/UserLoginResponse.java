package com.a402.fairydeco.domain.user.dto;

import com.a402.fairydeco.domain.child.dto.MyPageChildListDTO;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserLoginResponse {

    private Integer userId;

}
