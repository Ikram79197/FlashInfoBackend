package com.flashinfo.service;

import com.flashinfo.dto.FlashInfoUserRequestModel;
import com.flashinfo.user.entity.FlashUser;

public interface FlashInfoUserService {
    public FlashUser addFlashInfoUser(FlashInfoUserRequestModel userRequestModel);
    public FlashUser getUserActive(String userLogin);
    public FlashUser getUserByUserName(String userName);
    public FlashUser saveUser(FlashUser user);
}
